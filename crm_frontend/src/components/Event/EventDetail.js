import React from 'react'
import moment from 'moment'
import { TextField } from '@mui/material'

function EventDetail({event}) {
  const timeFormat = "DD/MM/YY, hh:mm a"

  let participantList = ''
  if(event.participants){
    participantList = event.participants.map((participant)=> participant.name)
    participantList = participantList.join(", ")
  }

  return (
    <div className="event-detail">
      <div className="form-control"><TextField
        fullWidth
        multiline
        label="Event Name"
        value={event.eventName}
        variant="outlined"
        InputLabelProps={{shrink: true,}}
        InputProps={{readOnly: true}}
      /></div>
      <div className="form-control"><TextField
        fullWidth
        multiline
        label="Start Time"
        value={moment(event.startTime).format(timeFormat)}
        variant="outlined"
        InputLabelProps={{shrink: true,}}
        InputProps={{readOnly: true}}
      /></div>
      <div className="form-control"><TextField
        fullWidth
        multiline
        label="End Time"
        value={moment(event.endTime).format(timeFormat)}
        variant="outlined"
        InputLabelProps={{shrink: true,}}
        InputProps={{readOnly: true}}
      /></div>
      <div className="form-control"><TextField
        fullWidth
        multiline
        label="Participants"
        value={participantList}
        variant="outlined"
        InputLabelProps={{shrink: true,}}
        InputProps={{readOnly: true}}
      /></div>
      <div className="form-control"><TextField
        fullWidth
        multiline
        label="Description"
        value={event.description}
        variant="outlined"
        InputLabelProps={{shrink: true,}}
        InputProps={{readOnly: true}}
      /></div>
      <div className="form-control"><TextField
        fullWidth
        multiline
        label="Location"
        value={event.location}
        variant="outlined"
        InputLabelProps={{shrink: true,}}
        InputProps={{readOnly: true}}
      /></div>
      <div className="form-control"><TextField
        fullWidth
        multiline
        label="Date Added"
        value={moment(event.dateAdded).format(timeFormat)}
        variant="outlined"
        InputLabelProps={{shrink: true,}}
        InputProps={{readOnly: true}}
      /></div>
    </div>
  )
}

export default EventDetail
