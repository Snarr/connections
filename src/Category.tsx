import { motion, AnimatePresence } from 'framer-motion';
import type { CategoryModel } from './Types';


interface CategoryProps {
  category: CategoryModel
}

function Category({category}: CategoryProps) {

  const getCategoryItems = () => {
    let str = category.words[0]

    for (let i = 1; i < 4; i++) {
      str = `${str}, ${category.words[i]}`
    }

    return str
  }

  return (
    <AnimatePresence>
      <motion.div 
      className={`lg:w-[624px] w-[364px] h-[85px] 
      rounded-[6px]
      lg:text-lg text-xs
      flex justify-center items-center flex-col
      cursor-pointer select-none 
      font-nyt text-wrap text-center
      text-[#000000]`}
      style={{backgroundColor: category.color}}
      layout
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [1, 1, 1], scale: [0.5, 1.1, 1.0],
                 transition: { duration: 1, times: [0, 0.2, 0.4]} }}
      >
        <span className="font-nyt-bold font-bold">{category.title.toUpperCase()}</span>
        <span>{getCategoryItems().toUpperCase()}</span>
      </motion.div>
    </AnimatePresence>
  )
}

export default Category;