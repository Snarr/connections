import { motion, AnimatePresence } from 'motion/react';

interface MistakeProps {
  visible: boolean
}

const Mistake = ({visible}: MistakeProps) => {
  return (
    <AnimatePresence>
      <motion.div
      className="rounded-full w-5 h-5"
      style={{backgroundColor: (visible ? "#5A594E" : "#FFFFFF"),
      transitionProperty: "background-color", transitionDuration: "0.3s"}}>
        
      </motion.div>
    </AnimatePresence>
  )
}

export default Mistake;