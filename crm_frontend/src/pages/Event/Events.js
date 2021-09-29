import React from 'react'
import { useState, useEffect } from 'react'
import AddEvent from '../../components/Event/AddEvent'
import EventHeader from '../../components/Event/EventHeader'
import moment from 'moment'
import DataGridComp from '../../components/Event/DataGridComp'
import swal from 'sweetalert'
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import Button from '../../components/Event/Button'


const Events = () => {
  const timeFormat = "DD/MM/YY, hh:mm a"
  const [events, setEvents] = useState([])
  const [showAddEvent, setShowAddEvent] = useState(false)

  const defaultEvent = {
    eventName: '',
    startTime: new Date(),
    endTime: new Date(),
    participants: [],
    description: '',
    location: '',
    dateAdded: new Date()
  }

  const compareDate = (first, second) => {
    if(first.startTime < second.startTime){
      return -1
    }else if (first.startTime === second.startTime){
      return 0
    }else {
      return 1
    }
  }

  useEffect(() => {
    const getEvents = async () =>{
      const eventsFromBackEnd = await fetchEvents()
      //sort based on startTime
      eventsFromBackEnd.sort(compareDate)

      //preprocessing data for displaying in grid
      eventsFromBackEnd.forEach((event) => {
        event.id = event._id; 
        delete event._id; 
        event.startTime = moment(event.startTime).format(timeFormat);
        event.endTime = moment(event.endTime).format(timeFormat) 
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
      data.startTime = moment(data.startTime).format(timeFormat)
      data.dateAdded = moment(data.dateAdded).format(timeFormat)
      data.endTime = moment(data.endTime).format(timeFormat)
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

  const showDetailColumn = {
    width: 120,
    field:'showDetail',
    headerName: 'Detail',
    filterable:false,
    renderCell: (cellValues) => {
      return (
        <Link to={`/event/${cellValues.row.id}`}>
        <Button color={'blue'} text={'Detail'} onClick={null}/>
        </Link>
      );
    }
  }

  const deleteColumn = {
    width: 120,
    filterable: false,
    field:'deleteEvent',
    headerName: 'Delete',
    renderCell: (cellValues) => {
      return (
        <Tooltip title="Delete Event">
          <IconButton onClick={() => deleteEvent(cellValues.row.id)}>
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
      )
    }
  }

  const columns =[
    { field: 'eventName', headerName: 'Event Name', minWidth: 160, flex: 1},
    { field: 'startTime', headerName: 'Start Time', minWidth: 160, flex: 1, filterable:false},
    { field: 'endTime', headerName: 'End Time', minWidth: 160, flex: 1, filterable:false},
    // { field: 'description', headerName: 'Description', minWidth: 160, flex: 1, hide: true},
    { field: 'location', headerName: 'Location', minWidth: 160, flex: 1},
    { field: 'participants', headerName: 'Participants', minWidth: 160, flex: 1},
    // { field: 'dateAdded', headerName: 'Date Added', minWidth: 180, flex: 1, hide: true},
    showDetailColumn,
    deleteColumn
  ];

  return (
    <div className="Events" style={{marginLeft:"75px"}}>
      <EventHeader onAdd ={() => setShowAddEvent(!showAddEvent)} color={showAddEvent ? 'red' : 'blue'} text={showAddEvent ? 'Close' : 'Add'}/>
      {showAddEvent && <AddEvent event={defaultEvent} onEdit={null} onAdd={addEvent} closeForm ={() => setShowAddEvent(false)} text={'Add Event'}/>}
      <div className="listOfEvents">
        {events.length > 0 ? <DataGridComp events={events} columns={columns}></DataGridComp> : <CircularProgress />}
      </div>
      
    </div>
  )
}

export default Events