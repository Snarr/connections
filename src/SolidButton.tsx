export interface ButtonProps {
  children: string,
  onClick: () => void
}

function SolidButton({children, onClick}: ButtonProps) {
  return (
    <div
      onClick={onClick}
      className={`w-[188px] h-[46px] px-4 py-1
      flex justify-center items-center
      lg:text-[16px] text-md
      font-nyt
      font-[500]
      rounded-full
      select-none 
      bg-black text-white
      cursor-pointer
      `}
      >
      {children}
    </div>
  )
}

export default SolidButton;