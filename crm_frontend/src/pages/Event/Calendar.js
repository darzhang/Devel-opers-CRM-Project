import React from "react";
import { useState, useEffect } from 'react'

import AddEvent from '../../components/Event/AddEvent'
import Event from '../../components/Event/Event'
import EventHeader from '../../components/Event/EventHeader'
   
import { useHistory } from 'react-router-dom';

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Redirect } from 'react-router-dom'
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Contacts(props) {

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
    }

    return data
  }

  function redirectToEvent() {
  }
  //let history = useHistory();

  //function redirect(eventID){
  //  history.push('/event')
  //}
  return (
     <div className="Calendar">
            <h1>Calendar</h1>
            <Calendar 
              localizer={localizer} 
              events={events} 
              startAccessor="start"
              endAccessor="end"
              onDoubleClickEvent={redirectToEvent()}
              style={{ height: 500, margin: "50px" }} />
        </div>
  )

};

	