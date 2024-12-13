import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

function Category({category}) {

  const getCategoryItems = () => {
    let str = category.cards[0].content

    for (let i = 1; i < 4; i++) {
      str = `${str}, ${category.cards[i].content}`
    }

    return str
  }

  return (
    <AnimatePresence>
      <motion.div 
      className={`w-[624px] h-[80px] 
      rounded-[6px] 
      flex justify-center items-center flex-col
      cursor-pointer select-none 
      font-NYT text-wrap text-center
      text-[#000000]`}
      style={{backgroundColor: category.color}}
      layout
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [1, 1, 1], scale: [0.5, 1.1, 1.0],
                 transition: { duration: 1, times: [0, 0.2, 0.4]} }}
      >
        <span className="font-bold">{category.title.toUpperCase()}</span>
        <span>{getCategoryItems().toUpperCase()}</span>
      </motion.div>
    </AnimatePresence>
  )
}

Category.propTypes = {
  category: PropTypes.object.isRequired
}

export default Category;