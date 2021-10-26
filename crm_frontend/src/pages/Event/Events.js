import React from 'react'
import { useState, useEffect } from 'react'
// import AddEvent from '../../components/Event/AddEvent'
// import EventHeader from '../../components/Event/EventHeader'
import moment from 'moment-timezone'
import DataGridComp from '../../components/Event/DataGridComp'
import Swal from 'sweetalert2'
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
// import Button from '../../components/Event/Button'
import Button from "@material-ui/core/Button";
import EventDialog from '../../components/Event/EventDialog'
import axios from 'axios'

/* Display an event list page
 */
const Events = () => {
  const timeFormat = "DD/MM/YY, hh:mm a"
  const buttonDivStyle = { textAlign: "right", marginRight: "2%", marginBottom: "10px" };
  const [events, setEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [isUpcoming, setIsUpcoming] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const [isLoading,setIsLoading] = useState(true)

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

  /* Compare two dates 
   *
   * @param first First date
   * @param second Second date
   * @return integer value of the comparison
   */
  const compareDate = (first, second) => {
    if(first.startTime < second.startTime){
      return -1
    }else if (first.startTime === second.startTime){
      return 0
    }else {
      return 1
    }
  }

  // fetch list of contacts and events and preprocess some data to be compatible with the data grid component
  useEffect(() => {
    let mounted = true
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
      if(mounted){
        setEvents(eventsFromBackEnd)
        setPastEvents(pastArray)
        setUpcomingEvents(upcomingArray)
        setIsLoading(false)
      }
      
    }
    
    getEvents()

    return function cleanup() {
      mounted = false
    }
  }, [refresh])

  /* Fetch all contact list from the backend
   */
  const fetchContacts = async () => {
    const res = await axios.get('https://developer-crm-backend.herokuapp.com/contact', {withCredentials: true})
    const data = await res.data;

    return data
  }

  /* Fetch all event list from the backend
   */
  const fetchEvents = async () => {
    const res = await axios.get('https://developer-crm-backend.herokuapp.com/event', {withCredentials: true})
    const data = await res.data;

    return data
  }

  /* send new event based on the provided event object to the backend
   *
   * @param event Newly created event object
   */
  const addEvent = async (event) => {
    const res = await axios.post(
      `https://developer-crm-backend.herokuapp.com/event`, 
      event, 
      {withCredentials: true});

    if(res.status !== 400){
      const data = res.data
      data.id = data._id
      delete data._id
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

  /* Delete specific event with alert prior to the deletion of the event
   *
   * @param id Event ID of the deleted event
   * @param name Event name to be shown on the alert of the event deletion
   * @return integer value of the comparison
   */
  const deleteEvent = async (id, name) => {
    //get the data of the event
    const response = await axios.get(`https://developer-crm-backend.herokuapp.com/event/${id}`,{withCredentials: true})

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
        //send notification of the deleted event
        await axios.post(`https://developer-crm-backend.herokuapp.com/notify/delete`,
          response.data,
          {withCredentials: true}
        )
        
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
        <a href={"/event/" + cellValues.id} style={{textDecoration: "none", textAlign: "center"}}>
          <Button variant="contained" style={{textTransform: "none"}}>
            View Event
          </Button>
        </a>
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

  const fields = ['eventName', 'startTime', 'endTime', 'location', 'participants'];

  return (
    <div className="Events" style={{marginTop: "2%", marginLeft:"75px"}}>
      <div><h1>{isUpcoming ? 'Events' : 'Past Events'}</h1></div>
      {!isLoading && 
        <div style={buttonDivStyle}>
          <Button variant="contained" style={{textTransform: "none", marginRight: "1%"}} onClick = {() => setShowAddEvent(!showAddEvent)}>
            Add Event
          </Button>
          <Button variant="contained" style={{textTransform: "none"}} onClick = {() => setIsUpcoming(!isUpcoming)}>
            {isUpcoming ? 'Show Past Events' : 'Show Current Events'}
          </Button>
        </div>
      }
      {/* {showAddEvent && <AddEvent event={defaultEvent} onEdit={null} onAdd={addEvent} closeForm ={() => setShowAddEvent(false)} text={'Add Event'} readOnly={false} enableSubmit={true} participantsArray={[]}/>} */}
      <EventDialog onAdd={addEvent} isOpen={showAddEvent} setDialog={setShowAddEvent}/>
      <div className="listOfEvents" style={{marginTop: "1.5%"}}>
        {!isLoading ? 
        (isUpcoming ? <DataGridComp events={upcomingEvents} columns={columns} fields={fields}></DataGridComp> : <DataGridComp events={pastEvents} columns={columns}></DataGridComp> )
        : <CircularProgress />}
      </div>
    </div>
  )
}

export default Events