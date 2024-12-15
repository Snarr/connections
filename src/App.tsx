import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from "motion/react"
import Tile from './CardTile'

import Button from './Button'
import Category from './Category'
import Title from './Title'
import Mistake from './Mistake'

import RawGame from './GameDetails'
import { TileModel, CategoryModel } from './Types'

function importTileList(): TileModel[] {
  let newTilesList: TileModel[] = []
  for (let i = 0; i < 16; i++) {
    newTilesList.push({"word": "", selected: false})
  }

  RawGame.categories.forEach(importedCategory => {
    importedCategory.words.forEach(importedCard => {
      let newTile: TileModel = {
        word: importedCard.word,
        selected: false
      }
      newTilesList[importedCard.position-1] = newTile
    })
  })

  return newTilesList
}

function importCategories(): CategoryModel[] {
  let categories: CategoryModel[] = []

  RawGame.categories.forEach(category => {
    let newCategory: CategoryModel = {
      title: category.title,
      color: category.color,
      words: []
    }

    category.words.forEach(word => {
      newCategory.words.push(word.word)
    })

    categories.push(newCategory)
  })

  return categories;
}

const categoryList: CategoryModel[] = importCategories()
const initialTileList: TileModel[] = importTileList()

function App() {

  const [points, setPoints] = useState<number>(4)
  const [tileList, setTileList] = useState<TileModel[]>(initialTileList)
  const [revealedCategories, setRevealedCategories] = useState<CategoryModel[]>([])

  const selectedWords = useMemo(
    () => getSelectedWords(tileList),
    [tileList]
  );

  function getSelectedWords(tiles: TileModel[]): string[] {
    let selectedWordList: string[] = []

    tiles.forEach(tile => {
      if (tile.selected) {
        selectedWordList.push(tile.word)
      }
    })

    return selectedWordList;
  }

  const shuffle = () => {
    setTileList(prevTiles => {
      let newTiles = [...prevTiles];

      for (let i = 0; i < newTiles.length-1; i++) {
        const j = Math.floor(Math.random()*(newTiles.length-i)) + i;
        [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]]
      }

      return newTiles;
    })
  }
  
  const deselectAll = () => {
    setTileList(prevTiles => 
      prevTiles.map(prevTile => {
        return {...prevTile, selected: false}
      })
    )
  }

  const submit = () => {
    if (selectedWords.length != 4) {
      console.log("nah")
      return
    }

    let correctCategory: CategoryModel | null = null

    for (let i = 0; i < categoryList.length; i++) {
      let category = categoryList[i]
      let correctCount = 0

      for (let j = 0; j < category.words.length; j++) {
        let word = category.words[j]
        if (selectedWords.includes(word)) {
          correctCount++
          continue
        } else {
          correctCount = 0;
          break;
        }
      }

      if (correctCount == 4) {
        console.log("You win category: " + category.title)
        correctCategory = category
      }
    }

    if (correctCategory == null) {
      setPoints(prevPoints => prevPoints - 1)
    } else {
      const newTileList = [...tileList]
      if (tileList.length > 4) {

        const topRowWords: string[] = tileList.slice(0,4).map(tileModel => tileModel.word)
        const categoryWords: string[] = [...correctCategory.words]

        const outOfPlaceCategoryWords: string[] = categoryWords.filter(word => 
          !topRowWords.includes(word)
        )

        const outOfPlaceTopRowWords: string[] = topRowWords.filter(word => 
          !categoryWords.includes(word)
        )

        for (let i = 0; i < outOfPlaceTopRowWords.length; i++) {
          let outOfPlaceTopRowWord: string = outOfPlaceTopRowWords[i]
          let outOfPlaceTopRowWordIndex: number = -1;

          let outOfPlaceCategoryWord: string = outOfPlaceCategoryWords[i]
          let outOfPlaceCategoryWordIndex: number = -1;

          newTileList.forEach((tile, index) => {
            if (tile.word == outOfPlaceTopRowWord) {
              outOfPlaceTopRowWordIndex = index
            } else if (tile.word == outOfPlaceCategoryWord) {
              outOfPlaceCategoryWordIndex = index
            }
          })

          let temp = newTileList[outOfPlaceTopRowWordIndex]
          newTileList[outOfPlaceTopRowWordIndex] = newTileList[outOfPlaceCategoryWordIndex]
          newTileList[outOfPlaceCategoryWordIndex] = temp
        }
        

        setTileList(newTileList)
      }

      setTimeout(() => {
        let removeTileList = [...newTileList]

        removeTileList.splice(0, 4)

        setTileList(removeTileList)

        if (!revealedCategories.includes(correctCategory)) {
          setRevealedCategories((prevRevealedCategory) => [...prevRevealedCategory, correctCategory])
        }

        deselectAll()
      }, tileList.length == 4 ? 50 : 500)
    }

  }

  function toggleSelection (word: String): void {
    setTileList((prevTiles: TileModel[]) => {
        return prevTiles.map((t) => {
          if (t.word == word) {
            if (selectedWords.length >= 4) {
              return {...t, selected: false}
            }
            return {...t, selected: !t.selected}
          }
          return t
        })
      }
    )
  }

  return (
    <AnimatePresence>
      <motion.div layout className="flex flex-col gap-2 justify-center items-center w-full h-full">
        <Title/>
        { revealedCategories.length > 0 ? <div className="w-fit h-fit flex-col flex gap-2">
          {revealedCategories.map((category) => 
            <Category key={category.title} category={category}></Category>
          )}
        </div> : null }
        { revealedCategories.length < 4 ? <div className={`grid grid-rows-${4-revealedCategories.length} grid-cols-4 gap-2 w-fit h-fit`}>
          {tileList.map((tile: TileModel) =>
            <Tile
            key={tile.word}
            tile={tile}
            toggleSelection={() => { toggleSelection(tile.word) }}/>
          )}
        </div> : null}
        
        <div className="flex flex-row justify-center items-center gap-2 pt-2">
          Mistakes remaining:
          {[0,1,2,3].map((index) => 
            <Mistake key={index} visible={points > index}></Mistake>
          )}
        </div>

        <div className="flex flex-row gap-3 p-2">
          <Button onClick={shuffle} disabled={Object.keys(revealedCategories).length == 4}>Shuffle</Button>
          <Button onClick={deselectAll} disabled={selectedWords.length == 0}>Deselect All</Button>
          <Button onClick={submit} disabled={selectedWords.length < 4}>Submit</Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default App