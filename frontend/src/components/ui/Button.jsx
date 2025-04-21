import React from 'react'

const Button = (props) => {



  return (
    <button type={props.type} className='text-white border p-2  rounded-full 
    transform duration-200 hover:scale-105 active:scale-90
    ' onClick={props.onClick}>{props.message}</button>
  )
}

export default Button

