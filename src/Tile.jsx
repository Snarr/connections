import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'motion/react'

function Tile({children, isSelected, toggleSelection}) {

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
        (isSelected ? "bg-[#5A594E] text-[#FFFFFF]" : "bg-[#EFEFE6]")}
        layout
        exit={{ opacity: 0 }}
      >
        {children.toUpperCase()}
      </motion.div>
    </AnimatePresence>
  )
}

export default Tile;