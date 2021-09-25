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
// import Grid from '@material-ui/core/Grid';

export default function Home() {

  const [events, setEvents] = useState([])
  const [contactList, setContactList] = useState([]);
  
  useEffect(() => {
    getEvents()
    getContacts()
  })
  const getEvents = async () =>{
    // const eventsFromBackEnd = await fetchEvents()
    await axios.get("http://localhost:5000/event").then(res => {
      const list = res.data;
      const sortedList = list.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1)
      setEvents(sortedList);
    })
  }
  
  const getContacts = async () => {
    const BASE_URL = "http://localhost:5000";
    await axios.get(BASE_URL + "/contact").then(res => {
        const list = res.data;
        setContactList(list);
    })
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
    if (i === contactList.length - 5){
      break
    }
  }

  let upcomingEvents = []
  index = 0;
  for (let i = events.length - 1; i >= 0; i--){
    upcomingEvents[index++] = events[i];
    if (i === events.length - 5){
      break
    }
  }

  const contactString = 'Profile'
  const row = (contact, i) => (
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
      <TableContainer component={Paper} style={{width: "50%"}}>
        <Table >
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
              .map((contact, i) => row(contact, i))}
            {/* {emptyRows > 0 && (
              <TableRow style={{ height: 69.4 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
          </TableBody>
        </Table>
        
      </TableContainer>
    );
  }

  const eventString = "View"
  const eventRow = (event, i) => (
    <TableRow key={i}>
      <TableCell>{event.eventName}</TableCell>
      <TableCell>{event.startTime}</TableCell>
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
      <TableContainer component={Paper} style={{width: "50%"}}>
          <Table >
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
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: 69.4 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
    );
  }

  const marginStyle = { marginTop: "2%", marginLeft: "3%", marginRight: "5%"};
  const graphMarginStyle = { marginTop: "5%", marginLeft: "3%", marginRight: "8%"};
  //const graphMarginStyle = { marginTop: "2%", marginLeft: "3%", marginRight: "8%"};
  const contactMarginStyle = { marginTop: "0%", marginLeft: "6%", marginRight: "5%"};
  const eventMarginStyle = { marginTop: "0%", marginLeft: "6%", marginRight: "5%"};

  return (
    <div style={marginStyle}>
      <h2 style={{marginLeft:"10%", marginTop:"5%"}}>Activity Graph</h2>
      <div style={graphMarginStyle}>
        
        {/* 260 */}
        <ResponsiveContainer width="110%" height={400}>
          <AreaChart data={graphData}>

            <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
            </linearGradient>
            </defs>

            <Area dataKey="value" stroke="#2451B7" fill="url(#color)" />

            <XAxis dataKey="date" tickLine={false} label={{ value: "Pages", position: "insideBottom", dy: 5}}/>
            {/* label={{ value: "Pages", position: "insideBottom", dy: 15}} */}

            <YAxis
            dataKey="value"
            tickLine={false}
            tickFormatter={(str) => {
              if (str % 1 === 0) {
                return str;
              }
              return "";
            }} 
            label={{ value: "Number of Events", position: "insideLeft", angle: -90,   dy: 0}}
            />

            <Tooltip formatter={function(value, name) {
              return [`${value}`, 'Number of Events'];
            }}/>
            <CartesianGrid opacity={0.5} vertical={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* <div style={contactMarginStyle}>
        <Grid container spacing={5}>
          <Grid container item xs={12} spacing={3}>
            <ContactTable/>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <EventTable/>
          </Grid>
        </Grid>
      </div> */}

      {/* <div style={contactMarginStyle}>
        <h3 style={{marginLeft:"21%", textAlign:'left'}}>Recently Added</h3>
        <ContactTable/> <EventTable/>
      </div>

      <div style={eventMarginStyle}>
       <h3 style={{marginLeft:"21%", textAlign:'left'}}>Recently</h3>
        <EventTable/>
      </div> */}
    </div>
  );
}