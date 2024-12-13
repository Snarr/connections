import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'motion/react'

function Tile({key, children, isSelected, toggleSelection}) {

  return (
    <AnimatePresence>
      <motion.div
      key={key}
      onClick={toggleSelection}
      className={`w-[150px] h-[80px] 
      rounded-[6px] 
      flex justify-center items-center
      cursor-pointer select-none 
      font-NYT font-bold text-wrap text-center `
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

Tile.propTypes = {
  key: PropTypes.number.isRequired,
  children: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  toggleSelection: PropTypes.func.isRequired
}

export default Tile;