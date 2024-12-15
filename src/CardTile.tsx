
import { AnimatePresence, motion } from 'motion/react'
import type { TileModel } from './Types';

interface TileProps {
  tile: TileModel,
  toggleSelection: () => void
}

const Tile: React.FC<TileProps> = ({tile, toggleSelection}) => {
  return (
    <AnimatePresence>
      <motion.div
        onClick={toggleSelection}
        className={`lg:w-[150px] w-[85px] h-[85px] 
        lg:text-lg text-[0.7rem]
        rounded-[6px] 
        flex justify-center items-center
        cursor-pointer select-none 
        font-nyt-bold font-bold text-wrap text-center 
        lg:leading-5 leading-3 `
        +
        (tile.selected ? "bg-[#5A594E] text-[#FFFFFF]" : "bg-[#EFEFE6]")}
        layout
        exit={{ opacity: 0 }}
      >
        {tile.word.toUpperCase()}
      </motion.div>
    </AnimatePresence>
  )
}

export default Tile;