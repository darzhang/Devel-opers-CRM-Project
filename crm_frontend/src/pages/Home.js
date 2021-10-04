import React from "react";
import { useState, useEffect } from 'react'
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

export default function Home() {
  const [events, setEvents] = useState([])
  const [contactList, setContactList] = useState([]);
  
  useEffect(() => {
    getEvents()
    getContacts()
  }, [])

  const getEvents = async () =>{
    await axios.get("http://localhost:5000/event").then(res => {
      const list = res.data;
      const sortedList = list.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1)
      setEvents(sortedList);
    }).catch((error) => {
      console.error(error);
    });
  }
  
  const getContacts = async () => {
    await axios.get("http://localhost:5000/contact").then(res => {
        const list = res.data;
        setContactList(list);
    }).catch((error) => {
    console.error(error);
  });
  }

  // Initial values for dates
  let date = new Date();
  let endDate = new Date();
  endDate.setDate(endDate.getDate() + 30)
  date.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)
  let dateTime = date.getTime();
  let endDateTime = endDate.getTime();
  let graphEvents = [];

  // Gets all the events that is within 30 days from current day
  for (let i = 0; i < events.length; i++){
    let newStartDate = new Date(events[i].startTime)
    let newEndDate = new Date(events[i].endTime)
    let newEndDateTime = newEndDate.getTime();
    if (dateTime <= newEndDateTime && newEndDateTime <= endDateTime){
      graphEvents.push({
        eventsListID: events[i]._id,
        Name: events[i].eventName,
        startDate: newStartDate,
        endDate: newEndDate
      })
    }
  }

  // Get all the frequency of events each day for 30 days from current time
  let graphData = []
  if (graphEvents && graphEvents.length > 0){
    date.setDate(date.getDate() - 1)
    for (let num = 0; num < 30; num++){
      let tempDate = new Date(date.setDate(date.getDate() + 1));
      graphData.push({
        graphDate: tempDate,
        date: tempDate.toDateString(),
        value: 0
      })
      
      graphData[num].graphDate.setHours(0, 0, 0, 0)
      let graphDateTime = graphData[num].graphDate.getTime();
      for (let i = 0; i < graphEvents.length; i++){
        let earlyStartDate = new Date(graphEvents[i].startDate)
        earlyStartDate.setHours(0, 0, 0, 0)
        let lateEndDate = new Date(graphEvents[i].endDate)
        lateEndDate.setHours(23, 59, 59, 999)
        if (graphDateTime >= earlyStartDate.getTime() && graphDateTime <= lateEndDate.getTime()){
          graphData[num].value++;
        }
      }
    }
  }

  let lastFiveContacts = []
  let index = 0;
  for (let i = contactList.length - 1; i >= 0; i--){
    lastFiveContacts[index++] = contactList[i];
    if (i === contactList.length - 4){
      break
    }
  }

  let upcomingEvents = []
  index = 0;
  for (let i = 0; i < events.length; i++){
    if (events[i].startTime > (new Date()).toISOString()) {
      upcomingEvents[index++] = events[i];
    }
    if (index === 4){
      break
    }
  }
  upcomingEvents.reverse()
  
  const contactString = 'Profile'
  const contactRow = (contact, i) => (
    <TableRow key={i}>
      <TableCell>{contact.contactName}</TableCell>
      <TableCell>{contact.email}</TableCell>
      <TableCell>{contact.phoneNumbers.mobile}</TableCell>
      <TableCell align="center">
        <a href={"/contact/profile/" + contact._id} style={{textDecoration: "none"}}>
          <Button variant="contained" style={{textTransform: "none", maxWidth: '70px', maxHeight: '15px', minWidth: '70px', minHeight: '10px', fontSize: '12px'}}>
            {contactString}
          </Button>
        </a>
      </TableCell>
    </TableRow>
  )
  function ContactTable(){
    return(
      <TableContainer component={Paper} style={{width: "100%", maxHeight: "270px"}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>Name</TableCell>
              <TableCell style={{fontWeight: "bold"}}>Email</TableCell>
              <TableCell style={{fontWeight: "bold"}}>Phone Number</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lastFiveContacts
              .map((contact, i) => contactRow(contact, i))}
          </TableBody>
        </Table>
        
      </TableContainer>
    );
  }

  upcomingEvents.reverse();
  const eventString = "View"
  const eventRow = (event, i) => (
    <TableRow key={i}>
      <TableCell>{event.eventName}</TableCell>
      <TableCell>{event.startTime.substr(0, 10)}</TableCell>
      <TableCell align="center">
        <a href={"/event/" + event._id} style={{textDecoration: "none"}}>
          <Button variant="contained" style={{textTransform: "none", maxWidth: '70px', maxHeight: '15px', minWidth: '70px', minHeight: '10px', fontSize: '12px'}}>
            {eventString}
          </Button>
        </a>
      </TableCell>
    </TableRow>
  )

  function EventTable(){
    return(
      <TableContainer component={Paper} style={{width: "100%", maxHeight: "270px"}}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{fontWeight: "bold"}}>Event Name</TableCell>
                <TableCell style={{fontWeight: "bold"}}>Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {upcomingEvents
                .map((contact, i) => eventRow(contact, i))}
            </TableBody>
          </Table>
        </TableContainer>
    );
  }

  const marginStyle = { marginTop: "2%", marginLeft: "3%", marginRight: "5%"};
  const graphMarginStyle = { marginTop: "2%", marginLeft: "3%", marginRight: "8%"};
  const eventMarginStyle = { marginTop: "0%", marginLeft: "7%", marginRight: "0%"};
  const contactMarginStyle = { marginTop: "0%", marginLeft: "2%", marginRight: "0%"};

  return (
    <div style={marginStyle}>

      <h2 style={{marginLeft:"8%", marginTop:"0%"}}>Activity Graph</h2>
      <div style={graphMarginStyle}>
        <ResponsiveContainer width="110%" height={260}>
          <AreaChart data={graphData}>

            <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
            </linearGradient>
            </defs>

            <Area dataKey="value" stroke="#2451B7" fill="url(#color)" />

            <XAxis 
              dataKey="date" 
              tickLine={false}
              tickFormatter={(str) => {
                return str.toString().substr(3, 7);
              }} />

            <YAxis
            dataKey="value"
            tickLine={false}
            tickFormatter={(str) => {
              if (str % 1 === 0) {
                return str;
              }
              return "";
            }} 
            label={{ value: "Number of Events", position: "insideLeft", angle: -90,   dy: 50}}/>

            <Tooltip 
              formatter={function(value, name) {
                return [`${value}`, 'Number of Events'];
              }}/>

            <CartesianGrid 
              opacity={0.5} 
              vertical={false} />

          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className='trow'>
        <div style={eventMarginStyle} className='tcolumn'>
          <h3 style={{marginLeft:"2%", marginTop:"2%"}}>Upcoming Events</h3>
          <EventTable></EventTable>
        </div>

        <div style={contactMarginStyle} className='tcolumn2'>
          <h3 style={{marginLeft:"2%", marginTop:"2%"}}>Recently Added</h3>
          <ContactTable></ContactTable>
        </div>
      </div>
    </div>
  );
}