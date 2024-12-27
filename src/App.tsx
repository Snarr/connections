import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "motion/react"
import Tile from './CardTile'

import Button from './Button'
import Category from './Category'
import Title from './Title'
import Mistake from './Mistake'

import RawGame from './GameDetails'
import { CategoryModel, GuessModel } from './Types'
import Splash from './Splash'

import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

function importTileList(): string[] {
  const newTilesList: string[] = []
  for (let i = 0; i < 16; i++) {
    newTilesList.push("")
  }

  RawGame.categories.forEach(importedCategory => {
    importedCategory.words.forEach(importedCard => {
      newTilesList[importedCard.position-1] = importedCard.word
    })
  })

  return newTilesList
}

function importCategories(): { [key: string]: CategoryModel } {
  const categories: { [key: string]: CategoryModel } = {}

  RawGame.categories.forEach(category => {
    const newCategory: CategoryModel = {
      title: category.title,
      color: category.color,
      words: []
    }

    category.words.forEach(word => {
      newCategory.words.push(word.word)
    })

    categories[newCategory.title] = newCategory
  })

  return categories;
}

const categoryMap: { [key: string]: CategoryModel } = importCategories()
const initialTileList: string[] = importTileList()

enum ScreenEnum {
  Splash,
  Game,
  Results
}

function App() {

  const { width, height } = useWindowSize()
  const [points, setPoints] = useState<number>(4)
  const [tileList, setTileList] = useState<string[]>(initialTileList)
  const [revealedCategories, setRevealedCategories] = useState<CategoryModel[]>([])
  const [screen, setScreen] = useState<ScreenEnum>(ScreenEnum.Splash)
  const [selectedTiles, setSelectedTiles] = useState<string[]>([])
  const [guesses, setGuesses] = useState<GuessModel[]>([])
  const [processingGuess, setProcessingGuess] = useState<boolean>(false)
  const [showToast, setShowToast] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string>("")
  const [showedResults, setShowedResults] = useState<boolean>(false)

  // Process guesses
  useEffect(() => {
    function moveCards(guess: GuessModel) {
      setTileList(prevTileList => {
        const newTileList: string[] = [...prevTileList]
  
        const guessWords: string[] = guess.words.map(word => word.word)
        const firstFourWords: string[] = newTileList.slice(0, 4)
    
        // 1. Get 1:1 mapping of misplaced cards
        //   - [a, b] -> [c, d]
        const guessWordsMisplaced: string[] = guessWords.filter(word => !firstFourWords.includes(word))
        const firstFourWordsMisplaced: string[] = firstFourWords.filter(word => !guessWords.includes(word))
    
        // 2. Swap the cards on the board
        //   - [c, b] -> [a, d]
        //   - [c, d] -> [a, b]
        for (let i = 0; i < guessWordsMisplaced.length; i++) {
          const word1 = guessWordsMisplaced[i]
          const word2 = firstFourWordsMisplaced[i]
          const word1idx: number = newTileList.indexOf(word1)
          const word2idx: number = newTileList.indexOf(word2)
    
          const tempWord: string = newTileList[word1idx]
          newTileList[word1idx] = newTileList[word2idx]
          newTileList[word2idx] = tempWord
        }
  
        return newTileList
      })
    }

    function processGuess() {
      if (guesses.length == 0) {
        return
      }

      setProcessingGuess(true)

      const guess = guesses[guesses.length-1]
  
      if (guess.correct) {
        // 1. Move guess cards to positions 0,1,2,3
        moveCards(guesses[guesses.length-1])

        // Wait for movement animation to finish...
        setTimeout(() => {
          // 2. Remove guest cards from board
          popTopCards()
          // 3. Push category card
          pushNewCategory(guess)
          // 4. Remove selections
          deselectAll()

          setProcessingGuess(false)
        }, 500)
        
      } else {
        setToastMessage("Wrong!")
        setShowToast(true)
        setPoints(prevPoints => prevPoints-1)
        setProcessingGuess(false)
      }
    }

    processGuess()
  }, [guesses])

  useEffect(() => {
    if (tileList.length == 0 && processingGuess == false && !showedResults) {
      setTimeout(() => {
        setScreen(ScreenEnum.Results)
        setShowedResults(true)
      }, 2000)
    }
  }, [tileList, processingGuess, showedResults])

  useEffect(() => {
    if (showToast == false) return

    setTimeout(() => {
      setShowToast(false)
    }, 5000)
  }, [showToast])

  const shuffle = () => {
    setTileList(prevTiles => {
      const newTiles = [...prevTiles];

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

  const submitGuess = () => {
    if (selectedTiles.length != 4) {
      console.log("nah")
      return
    }

    const guess: GuessModel = {
      words: [],
      correct: false
    }

    selectedTiles.forEach(word => {
      Object.values(categoryMap).find(category => {
        if (category.words.includes(word)) {
          guess.words.push({
            word: word,
            category: category.title
          })
          return true
        }
      })
    })

    if (guess.words[0].category == guess.words[1].category &&
      guess.words[1].category == guess.words[2].category &&
      guess.words[2].category == guess.words[3].category) {
      guess.correct = true
    }

    setGuesses(prevGuesses => [...prevGuesses, guess])
  }

  function toggleSelection (word: string): void {
    const wordIdx = selectedTiles.indexOf(word)

    if (wordIdx != -1) {
      setSelectedTiles(prevSelectedTiles => prevSelectedTiles.filter(tile => tile != word))
      return
    }

    if (selectedTiles.length >= 4) {
      return
    }

    setSelectedTiles(prevSelectedTiles => [...prevSelectedTiles, word])
  }

  function popTopCards() {
    setTileList(prevTileList => prevTileList.slice(4, prevTileList.length))
  }

  function pushNewCategory(guess: GuessModel) {
    setRevealedCategories(prevRevealedCategories => {
      if (prevRevealedCategories.length == 4) return prevRevealedCategories
      // Find category that matches guess
      const newCategory = categoryMap[guess.words[0].category]

      if (newCategory && !prevRevealedCategories.includes(newCategory)) return [...prevRevealedCategories, newCategory]

      return prevRevealedCategories
    })
  }

  return (
    <AnimatePresence>
      {screen == ScreenEnum.Splash &&
      <Splash key="splash" onClick={() => { setScreen(ScreenEnum.Game) }}></Splash>
      }
      {screen == ScreenEnum.Game &&
      <motion.div key="game" transition={{duration: 1}} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col gap-2 justify-center items-center w-full h-full">
        <Title/>
        { revealedCategories.length > 0 ? <div className="w-fit h-fit flex-col flex gap-2">
          {revealedCategories.map((category) => 
            <Category key={category.title} category={category}></Category>
          )}
        </div> : null }
        { revealedCategories.length < 4 ? <div className={`grid grid-rows-${4-revealedCategories.length} grid-cols-4 gap-2 w-fit h-fit`}>
          {tileList.map((tile: string) =>
            <Tile
              key={tile}
              tile={tile}
              selected={selectedTiles.includes(tile)}
              toggleSelection={() => { toggleSelection(tile) }}/>
          )}
        </div> : null}
        
        <div className="flex flex-row justify-center items-center gap-2 pt-2">
          Mistakes remaining:
          {[0,1,2,3].map((index) => 
            <Mistake key={index} visible={points > index}></Mistake>
          )}
        </div>

        <div className="flex flex-row gap-3 p-2">
          <Button onClick={shuffle} disabled={processingGuess || Object.keys(revealedCategories).length == 4}>Shuffle</Button>
          <Button onClick={deselectAll} disabled={processingGuess || selectedTiles.length == 0}>Deselect All</Button>
          <Button onClick={submitGuess} disabled={processingGuess || selectedTiles.length < 4}>Submit</Button>
          {showedResults && <Button onClick={() => setScreen(ScreenEnum.Results)} disabled={false}>Show Results</Button>}
        </div>
      </motion.div>
      }
      {screen == ScreenEnum.Results &&
      <motion.div key="result" transition={{duration: 1}} initial={{opacity: 0}} animate={{opacity: 1}} className="w-full h-full">
        <Confetti width={width} height={height} recycle={false} numberOfPieces={1000} tweenDuration={10000}></Confetti>
        <motion.div key="results-holder" className="w-full h-full flex flex-col justify-center items-center gap-5" transition={{duration: 3}} initial={{opacity: 0}} animate={{opacity: 1}} >
          <div className="font-nyt-bold text-center">
            Happy 6 months Millie <br/>
            I love you so much <br/>
            ❤️💛💜🦖😘
          </div>
          <div className="absolute top-0 md:w-2/3 w-full h-fit flex flex-row justify-end items-center p-5 gap-2 cursor-pointer select-none"
          onClick={() => setScreen(ScreenEnum.Game)}>
            <div className="flex justify-center items-center font-nyt-bold">
              Back to puzzle
            </div>
            <img src="./close.svg" className="w-6 h-6"></img>
          </div>
          <div className="flex flex-col gap-[2px]">
            {guesses.map((guess, guess_idx) => (
              <div key={"guessRow_" + guess_idx} className="flex flex-row gap-[1px]">
                {guess.words.map((word, word_idx) => {
                  return <div key={"guessBlock_" + word_idx} className="w-5 h-5 rounded-sm" style={{backgroundColor: categoryMap[word.category].color}}> </div>
                })}
              </div>
            ))}
          </div>
          
          <Button onClick={() => {
            let resultsString = `Millie's Connections\n6 month anniversary`

            guesses.forEach(guess => {
              resultsString += `\n`

              guess.words.forEach(word => {
                const color = categoryMap[word.category].color
                switch(color) {
                  case "#A0C35A":
                    resultsString += "🟩"
                    break
                  case "#F9DF6D":
                    resultsString += "🟨"
                    break
                  case "#BA81C5":
                    resultsString += "🟪"
                    break
                  case "#B0C4EF":
                    resultsString += "🟦"
                    break
                }
              })
            })

            setToastMessage("Copied to clipboard!")
            setShowToast(true)
            navigator.clipboard.writeText(resultsString)
          }} disabled={false}>Share your results</Button>
          </motion.div>
        </motion.div>
      }
      {showToast && 
      <motion.div className="absolute w-full flex justify-center items-center" transition={{type: 'spring'}} initial={{bottom: -50, opacity: 0}} animate={{bottom: 30, opacity: 1}} exit={{bottom: -50, opacity: 0}}>
        <div className="w-fit h-fit p-3 font-nyt bg-black text-white rounded-full">
          {toastMessage}
        </div>
      </motion.div>}
    </AnimatePresence>
  )
}

export default App