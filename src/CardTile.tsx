
import { AnimatePresence, motion } from 'motion/react'
interface TileProps {
  tile: string,
  selected: boolean,
  toggleSelection: () => void
}

const Tile: React.FC<TileProps> = ({tile, selected, toggleSelection}) => {
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
        (selected ? "bg-[#5A594E] text-[#FFFFFF]" : "bg-[#EFEFE6]")}
        layout
        exit={{ opacity: 0 }}
      >
        {tile.toUpperCase()}
      </motion.div>
    </AnimatePresence>
  )
}

export default Tile;