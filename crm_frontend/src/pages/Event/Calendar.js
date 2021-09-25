import React from "react";
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function Contacts() {
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

  const [events, setEvents] = useState([])
  
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

    let eventsList = data;
    for (let i = 0; i < eventsList.length; i++){
      eventsList[i].title = eventsList[i].eventName
      eventsList[i].start = new Date(eventsList[i].dateTime)
      eventsList[i].end = new Date(eventsList[i].dateTime)
      eventsList[i].eventsListID = eventsList[i]._id;
    }

    return data
  }

  const history = useHistory();
  let eventID = '';
  function getEventID(){
    const newURL = '/event/' + eventID;
    return newURL
  }
  function redirectEvent() {
    history.push(getEventID());
  }

  const marginStyle = { marginTop: "6%", marginLeft: "10%", marginRight: "10%"};

  return (
    <div style={marginStyle}>
      <div className="Calendar" style={{marginLeft:"75px"}}>
              <h1 marginRight = "12%">Calendar</h1>
              <Calendar 
                localizer={localizer} 
                events={events} 
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={event => (eventID = event._id)}
                onDoubleClickEvent={redirectEvent}
                style={{ height: 500}} />
        </div>
      </div>
  )

}