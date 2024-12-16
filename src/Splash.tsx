import {motion} from "motion/react"
import SolidButton from './SolidButton';

type SplashProps = {
  onClick: () => void
}

function Splash({onClick}: SplashProps) {
  return (
    <motion.div exit={{opacity: 0}} className="w-full h-full flex flex-col justify-center items-center bg-[#B3A7FE] gap-4">
        <img src="./connections.svg" className="w-24 h-24"></img>
        <span className="text-[3rem] font-karnak font-bold text-black leading-none select-none cursor-default">Millie's Connections</span>
        <span className="text-lg font-nyt text-black select-none cursor-default leading-none mb-1">Group words that share a common thread.</span>
        <SolidButton onClick={onClick}>Play</SolidButton>
    </motion.div>
  )
}

export default Splash;