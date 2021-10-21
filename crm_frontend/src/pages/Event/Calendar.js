import React from "react";
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

export default function CalendarPage() {
  
  // Localisers
  const locales = {
    "en-AU": require("date-fns/locale/en-AU"),
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  })

  // useState hooks
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data from the Backend when loading the page
  useEffect(() => {
    let mounted = true
    const getEvents = async () =>{
      const eventsFromBackEnd = await fetchEvents()
      if(mounted){
        setEvents(eventsFromBackEnd)
      }
    }
    getEvents()
    return function cleanup() {
      mounted = false
    }
    
  }, [])

  /* Get the list of events for the user
   */
  const fetchEvents = async () => {
    const res = await axios.get('https://developer-crm-backend.herokuapp.com/event', {withCredentials: true});
    const data = res.data;
    let eventsList = data;
    for (let i = 0; i < eventsList.length; i++){
      eventsList[i].eventsListID = eventsList[i]._id
      eventsList[i].title = eventsList[i].eventName
      eventsList[i].start = new Date(eventsList[i].startTime)
      eventsList[i].end = new Date(eventsList[i].endTime)
    }
    setIsLoading(false);
    return data;
  };
    

  const history = useHistory();
  let eventID = '';

  /* Get the event ID
   */
  function getEventID(){
    const newURL = '/event/' + eventID;
    return newURL
  }

  /* Redirects to the corresponding event page
   */
  function redirectEvent() {
    history.push(getEventID());
  }

  // Margin Styles
  const marginStyle = { marginTop: "2%", marginLeft: "10%", marginRight: "10%"};

  
  return (
    <div style={marginStyle}>
      <div className="Calendar" style={{marginLeft:"50px"}}>
        <h1>Calendar</h1>
      </div>
      <div className="Calendar" style={{marginLeft:"75px"}}>
            {!isLoading ? <Calendar 
              localizer={localizer} 
              events={events} 
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={event => (eventID = event._id)}
              onDoubleClickEvent={redirectEvent}
              style={{ height: 600}} 
              /> : <CircularProgress />}
      </div>
    </div>
  )

}