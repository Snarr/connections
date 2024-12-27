export type TileModel = {
  word: string,
  selected: boolean
}

export type Word = {
  content: string
}

export type CategoryModel = {
  title: string,
  color: string,
  words: string[]
}

export type GuessModel = {
  words: {
    word: string,
    category: string,
  }[],
  correct: boolean
}