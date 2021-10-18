import React from 'react'
import {useParams} from 'react-router-dom'
import { useState, useEffect } from 'react'
import EventDetail from '../../components/Event/EventDetail'
import AddEvent from '../../components/Event/AddEvent'
import EventHeader from '../../components/Event/EventHeader'
import Swal from 'sweetalert2'
import { CircularProgress } from '@mui/material'
// import Button from '../../components/Event/Button'
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios'

const EventDetails = () => { 

  // const defaultEvent = {
  //   eventName: '',
  //   startTime: new Date(),
  //   endTime: new Date(),
  //   participants: [],
  //   description: '',
  //   location: '',
  //   dateAdded: new Date()
  // }
  
  const buttonStyle = { textTransform: "none", width: "108px" };
  const {id} = useParams()
  const [event, setEvent] = useState('')
  const [edit, setEdit] = useState(false)
  const [refresh, setRefresh] = useState(false)

  //Fetch Contacts
  const fetchContact = async () => {
    const res = await axios.get('https://developer-crm-backend.herokuapp.com/contact', {withCredentials: true})
    const data = await res.data
    const returnedData = []

    data.map((contact) => returnedData.push({name: contact.contactName, id: contact._id}))

    return returnedData
  }

  // Fetch one Event
  const fetchOneEvent = async (id) => {
    const res = await axios.get(`https://developer-crm-backend.herokuapp.com/event/${id}`, {withCredentials: true});
    const data = res.data;
    return data
  }

  //Edit existing event
  const editEvent = async (event) => {
    console.log(id)
    const res = await axios.post(
    `https://developer-crm-backend.herokuapp.com/event/edit/${id}`, 
    event, 
    {withCredentials: true})
    
    console.log("test")
    const data = res.data;
    console.log(res.status)

    if(res.status !== 400){
      Swal.fire({
        title: "Successful",
        text: "You have successfully edit the event!",
        icon: "success",
        showClass: {
          icon: ''
        }
      })
      setEvent('')
      setRefresh(!refresh)
      setEdit(!edit)

    }else {
      Swal.fire({
        title: "Failure",
        text: "You have failed to edit the event!",
        icon: "error",
        showClass: {
          icon: ''
        }
      });
    }
  }
  //Delete Event
  const deleteEvent = async (id, name) => {

    Swal.fire({
      title: `Do You Want to delete ${name} ?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showClass: {
        icon: ''
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axios.delete(`https://developer-crm-backend.herokuapp.com/event/${id}`, {
          withCredentials: true
        })

        if(res.status !== 400){
          Swal.fire({
            title: 'Deleted!',
            text: `${name} has been deleted.`,
            icon: 'success',
            showClass: {
              icon: ''
            }
          }).then(function() {
            window.location = '/event'
          })
        }else {
          Swal.fire({
            title: "Failure",
            text: "You have failed to delete the event!",
            icon: "error",
            showClass: {
              icon: ''
            }
          });
        }
      }
    })
  }

  // Re render page when the id in the params change
  useEffect(() => {
    let mounted = true
    const getEvent = async () => {
      const eventFromServer = await fetchOneEvent(id)
      const contacts = await fetchContact()

      //fill in the participants array matching the contact array format
      const participantsArray = []
      contacts.forEach((contact) =>{
        if((eventFromServer.participants).includes(contact.id)){
          participantsArray.push(contact)
        }
      })
      eventFromServer.participantsArray = participantsArray
      
      if(mounted){
        setEvent(eventFromServer)
      }
      
    }
    getEvent()

    return function cleanup() {
      mounted = false
    } 
    
  }, [id,refresh])
  


  return (
    <>
    {event
      ? (<div style={{marginLeft:'75px'}}>
          <h1>{edit ? 'Edit Event' : event.eventName}</h1>
          {/* <div style={{display: 'flex', flexDirection: 'row', alignItems:'center'}}>
            <div style={{flex: 1}}></div>
            <div style={{flex: 1, minWidth: '300px', flexGrow: 1}}><h1>{edit ? 'Edit Event' : event.eventName}</h1></div>
            <div style={{flex: 1}}><Button onClick={() => {setEdit(!edit)}} text={edit ? 'Close' : 'Edit Event'} color={edit ? 'secondary' : 'primary'} /></div>
          </div> */}
          {edit && <AddEvent event={event} onEdit={editEvent} readOnly={false}/>}
          {!edit && <AddEvent event={event} onEdit={editEvent} readOnly={true}/>}
          {!edit && (
            <div>
            <Button variant="contained" color="primary" onClick={() => setEdit(!edit)} style={buttonStyle}>
              <EditIcon />&nbsp;Edit
            </Button>&nbsp;
            <Button variant="contained" color="secondary" style={buttonStyle} onClick={() => {deleteEvent(event._id, event.eventName)}}>
              <DeleteIcon />&nbsp;Delete
            </Button>
            </div>
          )}
        </div>)
      : <CircularProgress /> 
    }
    </>
  )
}

export default EventDetails