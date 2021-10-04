import React from 'react'
import { useState, useEffect } from 'react'
// import AddEvent from '../../components/Event/AddEvent'
// import EventHeader from '../../components/Event/EventHeader'
import moment from 'moment'
import DataGridComp from '../../components/Event/DataGridComp'
import Swal from 'sweetalert2'
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import Button from '../../components/Event/Button'
import EventDialog from '../../components/Event/EventDialog'


const Events = () => {
  const timeFormat = "DD/MM/YY, hh:mm a"
  const [events, setEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [isUpcoming, setIsUpcoming] = useState(true)
  const [refresh, setRefresh] = useState(false)

  const defaultEvent = {
    eventName: '',
    startTime: new Date(),
    endTime: new Date(),
    participants: [],
    participantsArray: [],
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
      const contacts = await fetchContacts()
      const eventsFromBackEnd = await fetchEvents()
      //sort based on startTime
      eventsFromBackEnd.sort(compareDate)

      //Creating necessary array for past and upcoming events
      const pastArray = []
      const upcomingArray = []
      const today = (new Date()).toISOString()

      //preprocessing data for displaying in grid
      eventsFromBackEnd.forEach((event) => {
        // divide past event and upcoming event
        if(event.endTime < today){
          pastArray.push(event)
        }else{
          upcomingArray.push(event)
        } 

        //Get all the names of the participants of the event
        const names = []
        contacts.forEach((contact) => {
          if(event.participants.includes(contact._id)){
            names.push(contact.contactName)
          }
        })

        event.id = event._id; 
        delete event._id; 
        event.startTime = moment(event.startTime).format(timeFormat);
        event.endTime = moment(event.endTime).format(timeFormat) 
        event.dateAdded = moment(event.dateAdded).format(timeFormat);
        event.participants = names.join(", ")
      })
      setEvents(eventsFromBackEnd)
      setPastEvents(pastArray)
      setUpcomingEvents(upcomingArray)
    }

    getEvents()
  }, [refresh])

  //Fetch Contacts
  const fetchContacts = async () => {
    const res = await fetch('http://localhost:5000/contact')
    const data = await res.json()

    return data
  }

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

    if(res.status !== 400){
      const data = await res.json()
      data.id = data._id
      delete data._id

      //preprocessing data for display in grid
      data.startTime = moment(data.startTime).format(timeFormat)
      data.dateAdded = moment(data.dateAdded).format(timeFormat)
      data.endTime = moment(data.endTime).format(timeFormat)
      data.participants = data.participants.map((participant)=>participant.name).join(", ")
      Swal.fire({
        title: "Successful",
        text: "You have successfuly added new event!",
        icon: "success",
        showClass: {
          icon: ''
        }
      })
      setRefresh(!refresh)
      
    }else {
      Swal.fire({
        title: "Failure",
        text: "You have failed to add new event!",
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
        const res = await fetch(`http://localhost:5000/event/${id}`, {
          method: 'DELETE',
        })

        if(res.status !== 400){
          Swal.fire({
            title: 'Deleted!',
            text: `${name} has been deleted.`,
            icon: 'success',
            showClass: {
              icon: ''
            }
          })
          setRefresh(!refresh)
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
          <IconButton onClick={() => deleteEvent(cellValues.row.id, cellValues.row.eventName)}>
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
      <div><h1>{isUpcoming ? 'Events' : 'Past Events'}</h1></div>
      {events.length > 0 && <div style={{float:'right', marginRight: '2%', display: 'flex', flexDirection: 'row'}}>
        <Button color={showAddEvent ? 'red' : 'blue'} text={showAddEvent ? 'Close' : 'Add'} onClick = {() => setShowAddEvent(!showAddEvent)} />
        <Button color='blue' text={isUpcoming ? 'Show Past Events' : 'Show Upcoming Events'} onClick = {() => setIsUpcoming(!isUpcoming)} />
      </div>}
      {/* {showAddEvent && <AddEvent event={defaultEvent} onEdit={null} onAdd={addEvent} closeForm ={() => setShowAddEvent(false)} text={'Add Event'} readOnly={false} enableSubmit={true} participantsArray={[]}/>} */}
      <EventDialog onAdd={addEvent} isOpen={showAddEvent} setDialog={setShowAddEvent}/>
      <div className="listOfEvents">
        {events.length > 0 ? 
        (isUpcoming ? <DataGridComp events={upcomingEvents} columns={columns}></DataGridComp> : <DataGridComp events={pastEvents} columns={columns}></DataGridComp> )
        : <CircularProgress />}
      </div>
    </div>
  )
}

export default Events
