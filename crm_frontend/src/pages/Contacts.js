import axios from "axios";
// import React, { Component } from "react";

// export default class Contacts extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { contactList: [] };
//   }

//   componentDidMount = () => {
//     this.getContacts();
//   }

//   async getContacts() {
//       const BASE_URL = "http://localhost:5000";
//       await axios.get(BASE_URL + "/contact").then(res => {
//           this.setState({
//               contactList: res.data
//           });
//           console.log(this.state.contactList);
//       })
//   }

//   render() {
//     return (
//       <div>
//         <h1>Contact List</h1>
//         <ul>
//         {this.state.contactList.map(contact => (
//             <div>
//               <Contact {...contact} /><br />
//             </div>
//         ))}
//         </ul>
//       </div>
//     );
//   }
// }

// function Contact(contact) {
//   const { _id, contactName, email } = contact;
//   const tdStyle = { textAlign: "left" };
//   return (
//     <table>
//       <tr><td style={tdStyle}>Name: {contactName}</td></tr>
//       <tr><td>Email: {email}</td></tr>
//     </table>
//   );
// }


import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function Contacts () {

  const classes = useStyles();

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Mobile</TableCell>
            <TableCell align="right">Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.name}>
              <TableCell align="right">{contact.contactName}</TableCell>
              <TableCell align="right">{contact.phoneNumbers.mobile}</TableCell>
              <TableCell align="right">{contact.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


const contacts = [
  {
      "_id": "611bcd75764db685a889aa64",
      "contactName": "Vincent",
      "phoneNumbers": {
          "home": "",
          "work": "",
          "mobile": "0412345678"
      },
      "email": "vincent@gmail.com",
      "departmentId": "6123387adfe4774630bca82e",
      "organisationId": "61338af16e2e207206448a35",
      "description": "this is a description",
      "label": "label 1"
  },
  {
      "_id": "611bd2df24d5bd5864c429ca",
      "contactName": "Darren",
      "phoneNumbers": {
          "home": "",
          "work": "",
          "mobile": "0498765432"
      },
      "email": "darren@gmail.com",
      "departmentId": "6123387adfe4774630bca82e",
      "organisationId": "61338af16e2e207206448a35",
      "description": "this is a description",
      "label": "label 2"
  },
  {
      "_id": "612246e1a4c0216f41e6c3c7",
      "contactName": "Edward",
      "phoneNumbers": {
          "work": "123456",
          "home": "879203",
          "mobile": "0456789123"
      },
      "email": "edward@gmail.com",
      "departmentId": "6133209e6e2e207206448a33",
      "organisationId": "61338af16e2e207206448a35",
      "description": "this is an updated description",
      "label": "label 3"
  }
]