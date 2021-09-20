import React from 'react'
import moment from 'moment'
import {FaTimes} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Event = ({event, onDelete}) => {
  return (
    
    <div className="event" style={{display: 'flex', flexDirection: 'row'}} >
      <Link to={`/event/${event._id}`} style={{textDecoration: "none", color:"black"}} >
      <div>
        <div>Event Name: {event.eventName}</div>
        <div>Date & Time: {moment(event.dateTime).format('MMMM Do YYYY, h:mm:ss a')}</div>
        <div>Location: {event.location}</div>
        <div>Date Added: {moment(event.dateAdded).format('MMMM Do YYYY, h:mm:ss a')}</div>
      </div>
      </Link>
      <FaTimes size={30} style={{marginLeft: 'auto', color:'red', cursor: 'pointer'}} 
      onClick={onDelete} />
    </div>
  )
}

export default Event
