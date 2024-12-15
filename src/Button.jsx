import PropTypes from 'prop-types';

function Button({children, onClick, disabled}) {
  const color = disabled == true ? "rgb(151,151,151)" : "rgb(18,18,18)";

  return (
    <div
      aria-disabled={disabled}
      onClick={disabled ? null : onClick}
      className={`w-fit p-4
      lg:text-[16px] text-xs
      font-nyt
      font-[500]
      rounded-full
      border-solid border-[1px]
      select-none
      `}
      style={{borderColor: color, color: color, cursor: (disabled ? "default" : "pointer")}}
      >
      {children}
    </div>
  )
}

export default Button;