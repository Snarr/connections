import Button from './Button';
import {motion} from "motion/react"

type SplashProps = {
  onClick: () => void
}

function Splash({onClick}: SplashProps) {
  return (<motion.div exit={{opacity: 0}} className="w-full h-full flex flex-col justify-center items-center bg-[#B3A7FE]">
        <Button onClick={onClick} disabled={false}>Play</Button>
    </motion.div>
  )
}

export default Splash;