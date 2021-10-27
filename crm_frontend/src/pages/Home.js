import React from "react";
import { useState, useEffect } from 'react'
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Cell,
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

/* Display the Home page and shows an Activity graph consisting of the Number of events in the next 7 days,
 * a list of recently added contacts, as well as upcoming events
 *
 * @param props Data passed on from a parent component
 */
export default function Home() {

  // useState Hooks
  const [events, setEvents] = useState([])
  const [contactList, setContactList] = useState([]);
  const [focusBar, setFocusBar] = useState(null);
  const [mouseLeave, setMouseLeave] = useState(true);
  
  // Load data from the Backend when loading the page

  useEffect(() => {
    getEvents()
    getContacts()
  }, [])
  const getEvents = async () =>{
    // const eventsFromBackEnd = await fetchEvents()
    await axios.get("https://developer-crm-backend.herokuapp.com/event", {headers: { "Access-Control-Allow-Origin": "*" },withCredentials: true}).then(res => {
      const list = res.data;
      const sortedList = list.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1)
      setEvents(sortedList);
    }).catch(error => {
      console.log('server error');
      console.log(error);
    })
  }

  /* Get the list of contacts for the user
   */
  const getContacts = async () => {
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    await axios.get(BASE_URL + "/contact", {headers: { "Access-Control-Allow-Origin": "*" },withCredentials: true}).then(res => {
        const list = res.data;
        setContactList(list);
    }).catch(error => {
      console.log('server error');
      console.log(error);
    })
  }

  // Obtains the next upcoming events
  let upcomingEvents = []
  let index = 0;
  for (let i = 0; i < events.length; i++){
    if (events[i].startTime > (new Date()).toISOString()) {
      upcomingEvents[index++] = events[i];
    }
    if (index === 4){
      break
    }
  }
  upcomingEvents.reverse()
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
    for (let num = 0; num < 7; num++){
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

  // Obtains the last five contacts added
  let lastFiveContacts = []
  index = 0;
  for (let i = contactList.length - 1; i >= 0; i--){
    lastFiveContacts[index++] = contactList[i];
    if (i === contactList.length - 4){
      break
    }
  }

  
  /* Get the contact row for the contact table
   */
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

  /* Get the contact table
   */
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

  /* Get the event row for the event table
   */
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

  /* Get the event table
   */
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

  // Styles for the margins
  const marginStyle = { marginTop: "2%", marginLeft: "3%", marginRight: "5%"};
  const graphMarginStyle = { marginTop: "2%", marginLeft: "3%", marginRight: "8%"};
  const eventMarginStyle = { marginTop: "0%", marginLeft: "7%", marginRight: "0%"};
  const contactMarginStyle = { marginTop: "0%", marginLeft: "2%", marginRight: "0%"};


  return (
    <div style={marginStyle}>

      <h2 style={{marginLeft:"8%", marginTop:"0%"}}>Activity Graph</h2>
      <div style={graphMarginStyle}>
        <ResponsiveContainer width="110%" height={260}>
          <BarChart 
            width={730} 
            height={250} 
            data={graphData}
            onMouseMove={(state) => {
              if (state.isTooltipActive) {
                setFocusBar(state.activeTooltipIndex);
                setMouseLeave(false);
              } else {
                setFocusBar(null);
                setMouseLeave(true);
              }
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="value" fill="#2B5CE7">
            {graphData.map((entry, index) => (
              <Cell
                fill={
                focusBar === index || mouseLeave
                  ? "#2B5CE7"
                  : "rgba(43, 92, 231, 0.2)"
               }
              />
            ))}
            
            </Bar>
            <XAxis 
              dataKey="date"
              tickLine={false}/>

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
              cursor={false}
              formatter={function(value, name) {
                return [`${value}`, 'Number of Events'];
              }}/>

          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='trow'>
        <div style={eventMarginStyle} className='tcolumn'>
          <h3 style={{marginLeft:"2%", marginTop:"2%"}}>Upcoming Events</h3>
          <EventTable></EventTable>
        </div>

        <div style={contactMarginStyle} className='tcolumn'>
          <h3 style={{marginLeft:"2%", marginTop:"2%"}}>Recently Added</h3>
          <ContactTable></ContactTable>
        </div>
      </div>
    </div>
  );
}