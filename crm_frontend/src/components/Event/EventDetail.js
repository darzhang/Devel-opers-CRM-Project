import React from 'react'
import moment from 'moment'
import Button from '../../components/Event/Button'

function EventDetail({event}) {
  let participantList = ''
  if(event.participants){
    participantList = event.participants.map((participant)=> participant.name)
    participantList = participantList.join(", ")
  }

  return (
    <div className="event-detail">
      <div>Event Name : {event.eventName}</div>
      <div>Date & Time: {moment(event.dateTime).format('MMMM Do YYYY, h:mm:ss a')}</div>
      <div>Description: {event.description}</div>
      <div>Location: {event.location}</div>
      <div>Participants: {participantList} </div>
      <div>Date Added: {moment(event.dateAdded).format('MMMM Do YYYY, h:mm:ss a')}</div>
    </div>
  )
}

export default EventDetail
