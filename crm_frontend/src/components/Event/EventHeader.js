import React from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'

const EventHeader = ({onAdd, text, color}) => {
  return (
    <div className="header">
      <Link to={"/event"} style={{textDecoration: "none", color:"black"}} >
      <div style={{fontSize:"30px"}}>Event</div>
      </Link>
      <Button color={color} text={text} onClick = {onAdd} />
    </div>
  )
}

export default EventHeader
