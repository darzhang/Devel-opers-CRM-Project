import React from 'react'
import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import SuggestionDropDown from './SuggestionDropDown'
import Swal from 'sweetalert2'
import Button from '@material-ui/core/Button';
import axios from 'axios'

/* Create a component of textfields for the event detail page
 *
 * @param event The event objet to be shown on the textfields as prefilled value
 * @param onEdit Function to handle the event's data after being edited and saved
 * @param readOnly Boolean value to set the textfield to readOnly
 */
const AddEvent = ({event, onEdit, readOnly}) => {
  const buttonStyle = { textTransform: "none", width: "108px" };
  const [eventName, setEventName] = useState(event.eventName)
  const [startTime, setStartTime] = useState(moment(new Date(event.startTime)).format("yyyy-MM-DDTHH:mm"))
  const [endTime, setEndTime] = useState(moment(new Date(event.endTime)).format("yyyy-MM-DDTHH:mm"))
  const [participants, setParticipants] = useState(event.participantsArray)
  const [participantsList, setParticipantsList] = useState('')
  const [description, setDescription] = useState(event.description)
  const [location, setLocation] = useState(event.location)
  const [contacts, setContacts] = useState([])

  // Get the contact list when the page first load
  useEffect(() => {
    const getContacts = async () =>{
      const contactsFromBackEnd = await fetchContacts()
      setContacts(contactsFromBackEnd)
      const list = []
      participants.forEach((participant) => {
        list.push(participant.name)
      })
      setParticipantsList(list.join(", "))
    }
    getContacts()
  }, [])

  /* Fetch list of contacts from backend
   */
  const fetchContacts = async () => {
    const res = await axios.get('https://developer-crm-backend.herokuapp.com/contact', {withCredentials: true})
    const data = await res.data;
    const returnedData = [];

    data.map((contact) => returnedData.push({name: contact.contactName, id: contact._id}))
    
    return returnedData
  }
  /* Handle saving the changes to text field and sending it to the Backend
   *
   * @param e Event
   */
  const onSubmit = async (e) => {
    e.preventDefault()

    const dateAdded = new Date()

    //extract the participantsId from the participant list
    const participantsIdArray = []
    participants.map((participant) => participantsIdArray.push(participant.id))

    //Change time based on the local device timezone
    let newStartTime = new Date(startTime)
    let newEndTime = new Date(endTime)
    let newDateAdded = new Date(dateAdded)

    const data = {eventName,
      startTime: newStartTime,
      endTime: newEndTime,
      participants:participantsIdArray,
      description,
      location,
      dateAdded: newDateAdded,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isEmailed: false}

    if (data.startTime > data.endTime) {
      Swal.fire({
        title: "Error!",
        text: "End time must be after start time!",
        icon: "error",
        customClass: {
          container: 'my-swal'
      }
      })
      return;
    }

    onEdit(data)
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
          ? (<div className='form-control'>
              <TextField
                fullWidth
                multiline
                size="small"
                label="Participants"
                value={participantsList}
                variant="outlined"
                // InputLabelProps={{shrink: true,}}
                InputProps={{readOnly: (readOnly ? true : false)}}
              />
            </div>)
          : <SuggestionDropDown participants={participants} items={contacts} onChange={(value) => setParticipants(value)} size="small"/>
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
      {!readOnly && (
        <div>
          <Button type="submit" variant="contained" color="primary" style={buttonStyle}>Save</Button>&nbsp;
          <Button variant="contained" color="secondary" style={buttonStyle} onClick={() => window.location = `/event/${event._id}` }>Cancel</Button>
        </div>
      )}
    </form>
  )
}

export default AddEvent
