import PropTypes from 'prop-types';

function Button({children, onClick}) {
  return (
    <div onClick={onClick} className="w-fit p-4 rounded-full border-solid border-[rgb(18,18,18)] border-[1px] select-none cursor-pointer">
      {children}
    </div>
  )
}

Button.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Button;