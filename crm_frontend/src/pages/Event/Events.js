import React from 'react'
import { useState, useEffect } from 'react'
import AddEvent from '../../components/Event/AddEvent'
import EventHeader from '../../components/Event/EventHeader'
import moment from 'moment'
import DataGridComp from '../../components/Event/DataGridComp'
import swal from 'sweetalert'


const Events = () => {
  const timeFormat = "DD/MM/YY, hh:mm a"
  const [events, setEvents] = useState([])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const defaultEvent = {
    eventName: '',
    dateTime: new Date(),
    participants: [],
    description: '',
    location: '',
    dateAdded: new Date()
  }

  useEffect(() => {
    const getEvents = async () =>{
      const eventsFromBackEnd = await fetchEvents()
      //preprocessing data for displaying in grid
      eventsFromBackEnd.forEach((event) => {
        event.id = event._id; 
        delete event._id; 
        event.dateTime = moment(event.dateTime).format(timeFormat); 
        event.dateAdded = moment(event.dateAdded).format(timeFormat);
        event.participants = event.participants.map((participant)=>participant.name).join(", ")
      })
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

    if(res.status !== 400){
      swal({
        title: "Successful",
        text: "You have successfuly added new event!",
        icon: "success",
      });
      data.id = data._id
      delete data._id

      //preprocessing data for display in grid
      data.dateTime = moment(data.dateTime).format(timeFormat)
      data.dateAdded = moment(data.dateAdded).format(timeFormat)
      data.participants = data.participants.map((participant)=>participant.name).join(", ")


    setEvents([...events, data])
    }else {
      swal({
        title: "Failure",
        text: "You have failed to add new event!",
        icon: "error",
      });
    }
    
  }

  //Delete Event
  const deleteEvent = async (id) => {
    const res = await fetch(`http://localhost:5000/event/${id}`, {
      method: 'DELETE',
    })

    if(res.status !== 400){
      swal({
        title: "Successful",
        text: "You have successfuly deleted the event!",
        icon: "success",
      });
  
      setEvents(events.filter((event) => event.id !== id))
    }else {
      swal({
        title: "Failure",
        text: "You have failed to delete the event!",
        icon: "error",
      });
    }
    
  }

  return (
    <div className="Events" style={{marginLeft:"75px"}}>
      <EventHeader onAdd ={() => setShowAddEvent(!showAddEvent)} color={showAddEvent ? 'red' : 'blue'} text={showAddEvent ? 'Close' : 'Add'}/>
      {showAddEvent && <AddEvent event={defaultEvent} onEdit={null} onAdd={addEvent} closeForm ={() => setShowAddEvent(false)} text={'Add Event'}/>}
      <div className="listOfEvents">
        <DataGridComp events={events} onDelete={(id) => deleteEvent(id)}></DataGridComp>
      </div>
      
    </div>
  )
}

export default Events
