type GameDetailsCategory = {
  title: string,
  color: string,
  words: GameDetailsWordType[]
}

type GameDetailsWordType = {
  word: string,
  position: number
}

type GameDetailsType = {
  categories: GameDetailsCategory[]
}

const RawGame: GameDetailsType = {
  "categories": [
    {
      "title": "Places we've traveled to",
      "color": "#A0C35A",
      "words": [
        {
          "word": "Pittsburgh",
          "position": 2
        },
        {
          "word": "Outer Banks",
          "position": 10
        },
        {
          "word": "Camden Aquarium",
          "position": 7
        },
        {
          "word": "Corning",
          "position": 15
        }
      ]
    },
    {
      "title": "First words of shows we've watched together",
      "color": "#F9DF6D",
      "words": [
        {
          "word": "New",
          "position": 3
        },
        {
          "word": "Yellow",
          "position": 1
        },
        {
          "word": "Abbott",
          "position": 9
        },
        {
          "word": "Jersey",
          "position": 4
        }
      ]
    },
    {
      "title": "Teas that you like",
      "color": "#BA81C5",
      "words": [
        {
          "word": "High Noon",
          "position": 16
        },
        {
          "word": "Pure Leaf\nRaspberry",
          "position": 5
        },
        {
          "word": "Iced Dirty",
          "position": 8
        },
        {
          "word": "Thai",
          "position": 14
        }
      ]
    },
    {
      "title": "People with museums named after them",
      "color": "#B0C4EF",
      "words": [
        {
          "word": "Carnegie",
          "position": 13
        },
        {
          "word": "Rockwell",
          "position": 12
        },
        {
          "word": "Franklin",
          "position": 11
        },
        {
          "word": "Field",
          "position": 6
        }
      ]
    }
  ]
}

export default RawGame;