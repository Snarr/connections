import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "motion/react"
import './App.css'
import Tile from './Tile'
import Button from './Button'
import Category from './Category'

import gameDetails from './GameDetails.json'

function App() {
  useEffect(() => {
    let blankArray = []
    for (let i = 0; i < 16; i++) {
      blankArray.push(i)
    }

    gameDetails.categories.forEach(category => {
      category.cards.forEach(card => {
        blankArray[card.position-1] = card.content
      })
    })

    setTiles(blankArray)
  }, [])

  const shuffle = () => {
    setTiles(prevTiles => {
      let newTiles = [...prevTiles];

      for (let i = 0; i < newTiles.length-1; i++) {
        const j = Math.floor(Math.random()*(newTiles.length-i)) + i;
        [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]]
      }

      return newTiles;
    })
  }
  
  const deselectAll = () => {
    setSelectedTiles([])
  }

  const submit = () => {
    if (Object.keys(selectedTiles).length != 4) {
      console.log("nah")
      return
    }

    let correctCategory = null

    for (let i = 0; i < gameDetails.categories.length; i++) {
      let category = gameDetails.categories[i]
      let correctCount = 0

      for (let j = 0; j < category.cards.length; j++) {
        let card = category.cards[j].content

        if (Object.keys(selectedTiles).includes(card)) {
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
      console.log("Test")
      let swappedTileSet = [...tiles]
      for (let i = 0; i < 4; i++) {
        swappedTileSet[swappedTileSet.indexOf(correctCategory.cards[i].content)] = swappedTileSet[i]
        swappedTileSet[i] = correctCategory.cards[i].content
      }
      setTiles(swappedTileSet)

      setTimeout(() => {
        let removeTileSet = [...swappedTileSet]

        removeTileSet.splice(0, 4)

        setTiles(removeTileSet)

        setRevealedCategories((prevRevealedCategory) => [...prevRevealedCategory, correctCategory])

        setSelectedTiles([])
      }, 500)
    }

  }

  const [points, setPoints] = useState(4)
  const [tiles, setTiles] = useState([])
  const [selectedTiles, setSelectedTiles] = useState({})
  const [revealedCategories, setRevealedCategories] = useState([])

  return (
    <div className="flex flex-col gap-2 justify-center items-center w-full h-fit p-10">
      { revealedCategories.length > 0 ? <div className="w-fit h-fit flex-col flex gap-2">
        {revealedCategories.map((category) => 
          <Category key={category.title} category={category}></Category>
        )}
      </div> : null }
      { revealedCategories.length < 4 ? <div className={`grid grid-rows-${4-revealedCategories} grid-cols-4 gap-2 w-fit h-fit`}>
        {tiles.map((tile) =>
          <Tile key={tile} isSelected={Object.keys(selectedTiles).includes(tile)} toggleSelection={() => {
            setSelectedTiles((prevSelectedTiles) => {
              let newSelectedTiles = {...prevSelectedTiles}
              if (Object.keys(newSelectedTiles).includes(tile)) {
                delete newSelectedTiles[tile]
              } else if (Object.keys(newSelectedTiles).length < 4) {
                newSelectedTiles[tile] = true;
              }
              return newSelectedTiles
            })
          }}>{tile}</Tile>
        )}
      </div> : null}
      <div className="flex flex-row justify-center items-center gap-2 pt-2">
        Mistakes remaining:
        {[points > 0, points > 1, points > 2, points > 3].map((val, idx) => 
          <AnimatePresence key={idx}>
            {val ? 
            <motion.div exit={{ opacity: 0, scale: 1.1 }} className="bg-[#5A594E] rounded-full w-5 h-5">
              
            </motion.div> : null}
          </AnimatePresence>
        )}
      </div>
      <div className="flex flex-row gap-3 p-2">
        <Button onClick={shuffle}>Shuffle</Button>
        <Button onClick={deselectAll}>Deselect All</Button>
        <Button onClick={submit}>Submit</Button>
      </div>
    </div>
  )
}

export default App
