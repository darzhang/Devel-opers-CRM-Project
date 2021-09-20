import React from 'react'

const Button = ({onClick, text, color}) => {
  return (
    <div>
      <button onClick={onClick} style={{backgroundColor: color }} 
      className='btn'>{text}</button>
    </div>
  )
}

export default Button
