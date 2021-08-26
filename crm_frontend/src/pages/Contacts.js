import axios from "axios";
import React, { Component } from "react";

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = { contactList: [] };
  }

  componentDidMount = () => {
    this.getContacts();
  }

  async getContacts() {
      const BASE_URL = "http://localhost:5000";
      await axios.get(BASE_URL + "/contact").then(res => {
          this.setState({
              contactList: res.data
          });
          console.log(this.state.contactList);
      })
  }

  render() {
    return (
      <div>
        <h1>Contact List</h1>
        <ul>
        {this.state.contactList.map(contact => (
            <div>
              <Contact {...contact} /><br />
            </div>
        ))}
        </ul>
      </div>
    );
  }
}

function Contact(contact) {
  const { _id, contactName, email } = contact;
  const tdStyle = { textAlign: "left" };
  return (
    <table>
      <tr><td style={tdStyle}>Name: {contactName}</td></tr>
      <tr><td>Email: {email}</td></tr>
    </table>
  );
}