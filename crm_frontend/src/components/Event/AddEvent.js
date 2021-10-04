import React from 'react'
import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import SuggestionDropDown from './SuggestionDropDown'
import SuggestionDropDownDisabled from './SuggestionDropDownDisabled'

const AddEvent = ({event, onAdd, closeForm, onEdit,text, readOnly, enableSubmit}) => {
  const [eventName, setEventName] = useState(event.eventName)
  const [startTime, setStartTime] = useState(moment(new Date(event.startTime)).format("yyyy-MM-DDTHH:mm"))
  const [endTime, setEndTime] = useState(moment(new Date(event.endTime)).format("yyyy-MM-DDTHH:mm"))
  const [participants, setParticipants] = useState(event.participantsArray)
  const [description, setDescription] = useState(event.description)
  const [location, setLocation] = useState(event.location)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    const getContacts = async () =>{
      const contactsFromBackEnd = await fetchContacts()
      setContacts(contactsFromBackEnd)
    }
    getContacts()
  }, [])

  //Fetch Contacts
  const fetchContacts = async () => {
    const res = await fetch('http://localhost:5000/contact')
    const data = await res.json()
    const returnedData = []

    data.map((contact) => returnedData.push({name: contact.contactName, id: contact._id}))
    
    return returnedData
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const dateAdded = new Date()

    //extract the participantsId from the participant list
    const participantsIdArray = []
    participants.map((participant) => participantsIdArray.push(participant.id))

    const data = {eventName, startTime, endTime, participants:participantsIdArray, description, location, dateAdded: dateAdded}

    if(onEdit===null){
      onAdd(data)
      closeForm() 
    }else if(onAdd===null){
      onEdit(data)
    }
  }
  return (
    <form className='add-form' onSubmit={onSubmit}>
      <div style={{display: ((readOnly===false )? 'block' : 'none')}}className='form-control'>
        <TextField
          fullWidth
          multiline
          size="small"
          label="Event Name"
          // placeholder="Add Event Name"
          value={eventName}
          onChange={(e)=> setEventName(e.target.value)}
          variant="outlined"
          // InputLabelProps={{shrink: true,}}
          // InputProps={{readOnly: (readOnly ? true : false)}}
        />
      </div>
      <div className='form-control'>
        <TextField
          fullWidth
          size="small"
          type="datetime-local"
          label="Start Time"
          value={startTime}
          onChange={(e)=> setStartTime(e.target.value)}
          variant="outlined"
          // InputLabelProps={{shrink: true,}}
          InputProps={{readOnly: (readOnly ? true : false)}}
        /> 
      </div>
      <div className='form-control'>
        <TextField
          fullWidth
          size="small"
          type="datetime-local"
          label="End Time"
          value={endTime}
          onChange={(e)=> setEndTime(e.target.value)}
          variant="outlined"
          // InputLabelProps={{shrink: true,}}
          InputProps={{readOnly: (readOnly ? true : false)}}
        /> 
      </div>
      <div className='form-control'>
        {readOnly 
          ? <SuggestionDropDownDisabled participants={participants} items={contacts} onChange={(value) => setParticipants(value)}/>
          : <SuggestionDropDown participants={participants} items={contacts} onChange={(value) => setParticipants(value)}/>
        }
      </div>
      <div className='form-control'>
        <TextField
          fullWidth
          multiline
          size="small"
          label="Description"
          // placeholder="Add Description"
          value={description}
          onChange={(e)=> setDescription(e.target.value)}
          variant="outlined"
          // InputLabelProps={{shrink: true,}}
          InputProps={{readOnly: (readOnly ? true : false)}}
        />
      </div>
      <div className='form-control'>
      <TextField
          fullWidth
          multiline
          size="small"
          label="Location"
          // placeholder="Add Location"
          value={location}
          onChange={(e)=> setLocation(e.target.value)}
          variant="outlined"
          // InputLabelProps={{shrink: true,}}
          InputProps={{readOnly: (readOnly ? true : false)}}
        />
      </div>
      {enableSubmit && <input type='submit' value={text} className='btn btn-block'/>}
    </form>
  )
}

export default AddEvent
