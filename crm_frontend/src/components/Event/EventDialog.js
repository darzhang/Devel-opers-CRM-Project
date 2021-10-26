import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from "@material-ui/core";
import moment from "moment-timezone";
import SuggestionDropDown from "./SuggestionDropDown";
import Swal from 'sweetalert2'
import axios from "axios";


/* Create a dialog for creating new event
 *
 * @param isOpen Boolean value of whether the dialog is open or not
 * @param setDialog Function to set the the dialog open or close
 * @param onAdd Function to handle the process of add event
 */
export default function EventDialog({ isOpen, setDialog, onAdd}) {

  const initialState = {
    eventName: "",
    startTime: moment(new Date()).format("yyyy-MM-DDTHH:mm"),
    endTime: moment(new Date()).format("yyyy-MM-DDTHH:mm"),
    description: "",
    location: "",
    dateAdded: moment(new Date()).format("yyyy-MM-DDTHH:mm")
  };

  const [state, setState] = useState(initialState);
  const [contacts, setContacts] = useState([])
  const [participants, setParticipants] = useState([])

  /* Fetch contact list of the logged in user
   */
  const fetchContacts = async () => {
    const res = await axios.get('https://developer-crm-backend.herokuapp.com/contact', {withCredentials:true})
    const data = await res.data;
    const returnedData = []

    data.map((contact) => returnedData.push({name: contact.contactName, id: contact._id}))
    
    return returnedData
  }

  /* Handle any changes to the input text fields
   *
   * @param e Event
   */
  const onChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  /* Handle the closure of the event dialog
   */
  const handleClose = () => {
    setDialog(false);
    setState(initialState);
    setParticipants([])
    setContacts([])
  };

  /* Handle saving the changes to text field and sending it to the Backend
   *
   * @param e Event
   */
  const onSubmit = (e) => {
    e.preventDefault();

    //extract the participantsId from the participant list
    const participantsIdArray = []
    participants.map((participant) => participantsIdArray.push(participant.id))

    //Change time based on the local device timezone
    let newStartTime = new Date(state.startTime)
    let newEndTime = new Date(state.endTime)
    let newDateAdded = new Date(state.dateAdded)

    const data = {
      eventName: state.eventName, 
      startTime: newStartTime, 
      endTime: newEndTime, 
      participants:participantsIdArray, 
      description: state.description, 
      location: state.location, 
      dateAdded : newDateAdded,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isEmailed: false
    }

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
    onAdd(data)
    handleClose()
    
  };

  // Load contact from backend when the dialog loads
  useEffect(() => {
    let mounted = true
    const getContacts = async () =>{
      const contactsFromBackEnd = await fetchContacts()
      if(mounted){
        setContacts(contactsFromBackEnd)
      }
      
    }
    getContacts()

    return function cleanup() {
      mounted = false
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth={true} maxWidth={'xs'}>
      <form onSubmit={onSubmit}>
      <DialogTitle>Create Event</DialogTitle>
      <DialogContent>
        <div>

          <div className='form-control'>
            <TextField
              fullWidth
              multiline
              type="text"
              label="Event Name" 
              variant="outlined"
              name="eventName"
              value={state.eventName}
              onChange={onChange}
            />
          </div>

          <div className='form-control'>
            <TextField
              fullWidth
              type="datetime-local"
              label="Start Time" 
              variant="outlined"
              name="startTime"
              value={state.startTime}
              onChange={onChange}
            />
          </div>

          <div className='form-control'>
            <TextField
              fullWidth
              type="datetime-local"
              label="End Time" 
              variant="outlined"
              name="endTime"
              value={state.endTime}
              onChange={onChange}
            />
          </div>

          <div className='form-control'>
          <SuggestionDropDown 
            participants={participants} 
            items={contacts} 
            onChange={(value) => setParticipants(value)}
            size = "medium"/>
          </div>

          <div className='form-control'>
            <TextField
              fullWidth
              multiline
              type="text"
              label="Description" 
              variant="outlined"
              name="description"
              value={state.description}
              onChange={onChange}
            />
          </div>

          <div className='form-control'>
            <TextField
              fullWidth
              multiline
              type="text"
              label="Location" 
              variant="outlined"
              name="location"
              value={state.location}
              onChange={onChange}
            />
          </div>
        </div>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </DialogActions>
      </form>
    </Dialog>
  );
}