import React from 'react'
import {useParams} from 'react-router-dom'
import { useState, useEffect } from 'react'
import EventDetail from '../../components/Event/EventDetail'
import AddEvent from '../../components/Event/AddEvent'
import EventHeader from '../../components/Event/EventHeader'

const EventDetails = () => {
  //Fetch Particular Event
  const {id} = useParams()
  const [event, setEvent] = useState('')
  const [edit, setEdit] = useState(false)

  // Fetch one Event
  const fetchOneEvent = async (id) => {
    const res = await fetch(`http://localhost:5000/event/${id}`)
    const data = await res.json()
    return data
  }

  //Edit existing event
  const editEvent = async (event, id) => {
    const res = await fetch(`http://localhost:5000/event/edit/${id}`, {
      method:'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(event)
    })

    const data = await res.json()

    setEvent(data)
  }

  // Re render page when the id in the params change
  useEffect(() => {
    const getEvent = async () => {
      const eventFromServer = await fetchOneEvent(id)
      setEvent(eventFromServer)
      
    }
    getEvent()
  }, [id])
  


  return (
    <div>
      <EventHeader onAdd={()=>setEdit(!edit)} text={edit ? 'Close' : 'Edit Event'} color={edit ? 'red' : 'green'}/>
      {edit ? <AddEvent event={event} onEdit={editEvent} onAdd={null} id={id} closeForm={()=> setEdit(!edit)} /> :
      <EventDetail event={event} />}
    </div>
  )
}

export default EventDetails
