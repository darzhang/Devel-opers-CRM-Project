import React from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'

const EventHeader = ({onAdd, text, color}) => {
  const marginStyle = { marginTop: "2%", marginLeft: "40%", marginRight: "10%"};
  return (
    <div className="header" style={marginStyle}>
      <Link to={"/event"} style={{textDecoration: "none", color:"black"}} >
      <h1>Event</h1>
      </Link>
      <Button color={color} text={text} onClick = {onAdd} />
    </div>
  )
}

export default EventHeader
