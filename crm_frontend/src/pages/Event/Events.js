import React from 'react'
import { useState, useEffect } from 'react'
import AddEvent from '../../components/Event/AddEvent'
import Event from '../../components/Event/Event'
import EventHeader from '../../components/Event/EventHeader'


const Events = () => {
  const [events, setEvents] = useState([])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const defaultEvent = {
    eventName: '',
    dateTime: new Date(),
    participants: [],
    description: '',
    location: ''
  }

  useEffect(() => {
    const getEvents = async () =>{
      const eventsFromBackEnd = await fetchEvents()
      setEvents(eventsFromBackEnd)
    }

    getEvents()
  }, [])

  //Fetch Events
  const fetchEvents = async () => {
    const res = await fetch('http://localhost:5000/event')
    const data = await res.json()

    return data
  }

  //Add new Event
  const addEvent = async (event) => {
    const res = await fetch('http://localhost:5000/event/', {
      method:'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(event)
    })

    const data = await res.json()

    setEvents([...events, data])
  }

  //Delete Event
  const deleteEvent = async (id) => {
    await fetch(`http://localhost:5000/event/${id}`, {
      method: 'DELETE',
    })

    setEvents(events.filter((event) => event._id !== id))
  }


  return (
    <div className="Events">
      <EventHeader onAdd ={() => setShowAddEvent(!showAddEvent)} color={showAddEvent ? 'red' : 'green'} text={showAddEvent ? 'Close' : 'Add'}/>
      {showAddEvent && <AddEvent event={defaultEvent} onEdit={null} onAdd={addEvent} closeForm ={() => setShowAddEvent(false)}/>}
      <div className="listOfEvents">
        {events.map((event) => (
          <Event key={event._id} event= {event}
          onDelete={()=> deleteEvent(event._id)}
          />
        ))}
      </div>
      
    </div>
  )
}

export default Events
