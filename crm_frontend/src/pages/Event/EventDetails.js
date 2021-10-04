import React from 'react'
import {useParams} from 'react-router-dom'
import { useState, useEffect } from 'react'
import EventDetail from '../../components/Event/EventDetail'
import AddEvent from '../../components/Event/AddEvent'
import EventHeader from '../../components/Event/EventHeader'
import Swal from 'sweetalert2'
import { CircularProgress } from '@mui/material'
import Button from '../../components/Event/Button'

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
  
  const {id} = useParams()
  const [event, setEvent] = useState('')
  const [edit, setEdit] = useState(false)
  const [refresh, setRefresh] = useState(false)

  //Fetch Contacts
  const fetchContact = async () => {
    const res = await fetch('http://localhost:5000/contact')
    const data = await res.json()
    const returnedData = []

    data.map((contact) => returnedData.push({name: contact.contactName, id: contact._id}))

    return returnedData
  }

  // Fetch one Event
  const fetchOneEvent = async (id) => {
    const res = await fetch(`http://localhost:5000/event/${id}`)
    const data = await res.json()
    return data
  }

  //Edit existing event
  const editEvent = async (event) => {
    const res = await fetch(`http://localhost:5000/event/edit/${id}`, {
      method:'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(event)
    })

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

  // Re render page when the id in the params change
  useEffect(() => {
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
      
      setEvent(eventFromServer)
      
    }
    getEvent()
    
  }, [id,refresh])
  


  return (
    <>
    {event
      ? (<div style={{marginLeft:'75px'}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems:'center'}}>
            <div style={{flex: 1}}></div>
            <div style={{flex: 1, minWidth: '300px', flexGrow: 1}}><h1>{edit ? 'Edit Event' : event.eventName}</h1></div>
            <div style={{flex: 1}}><Button onClick={() => {setEdit(!edit)}} text={edit ? 'Close' : 'Edit Event'} color={edit ? 'secondary' : 'primary'} /></div>
          </div>
          {edit && <AddEvent event={event} onEdit={editEvent} onAdd={null} closeForm={null} text={'Save Changes'} readOnly={false} enableSubmit={true}/>}
          {!edit && <AddEvent event={event} onEdit={editEvent} onAdd={null} closeForm={null} text={'Save Changes'} readOnly={true} enableSubmit={false}/>}
        </div>)
      : <CircularProgress /> 
    }
    </>
  )
}

export default EventDetails