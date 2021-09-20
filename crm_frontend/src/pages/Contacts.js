import axios from "axios";
import React, { Component } from "react";

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      contactList: [],
      departmentList: [],
      searchInput: "",
      labelInput: "",
      selectedDepartmentName: "",
      selectedDepartmentId: null,
      showFilters: false,
      isLoading: true
    };
  }

  // load the data when loading the page
  componentDidMount = () => {
    this.getContacts();
    this.getDepartments();
    this.setState({
      isLoading: false
    });
  }

  // get list of contacts from the database and display them in an alphabetically sorted order
  async getContacts() {
    const BASE_URL = "http://localhost:5000";
    await axios.get(BASE_URL + "/contact").then(res => {
        const list = res.data;
        const sortedList = list.sort((a, b) => (a.contactName > b.contactName) ? 1 : -1)
        this.setState({
          contactList: sortedList
        });
        console.log(this.state.contactList);
    })
  }

  // get list of departments from the database
  async getDepartments() {
    const BASE_URL = "http://localhost:5000";
    await axios.get(BASE_URL + "/department").then(res => {
      this.setState({
        departmentList: res.data
      });
    })
  }

  // toggle function for filter button
  toggleFilters() {
    this.setState({
      showFilters: !this.state.showFilters
    });
  }

  // change search result based on contact name
  updateSearch(e) {
    this.setState({
      searchInput: e.target.value.substr(0)
    });
  }

  // change search result based on label
  updateLabel(e) {
    this.setState({
      labelInput: e.target.value.substr(0)
    });
  }

  // change search result based on the selected department
  updateDepartment(e) {
    this.setState({
      selectedDepartmentId: e.target.value,
      selectedDepartmentName: e.target.text
    });
  }

  render() {
    // Filter by name
    let filteredContacts = this.state.contactList.filter(contact => {
      return contact.contactName.toLowerCase().indexOf(this.state.searchInput.toLowerCase()) !== -1;
    });
    // Filter by label
    filteredContacts = filteredContacts.filter(contact => {
      return contact.label.toLowerCase().indexOf(this.state.labelInput.toLowerCase()) !== -1;
    })
    // Filter by department
    filteredContacts = filteredContacts.filter(contact => {
      if (this.state.selectedDepartmentName === "" || this.state.selectedDepartmentId === "") {
        return true
      }
      return contact.departmentId === this.state.selectedDepartmentId;
    })
    const searchBarStyle = {width: "20rem", background: "#F2F1F9", border: "none", padding: "0.5rem"};
    const filtersStyle = { textAlign: "left", marginLeft: "43px" };
    const buttonDivStyle = { textAlign: "right", marginRight: "43px" };
    const buttonStyle = { padding: "10px", fontSize: "16px", borderRadius: "4px", width: "120px" }
    const loadingStyle = { fontSize: "36px" };
    return (
      <div>
        {this.state.isLoading &&
        <div style={loadingStyle}>
            Loading...
        </div>}
        {!this.state.isLoading &&
        <div>
          <h1>Contact List</h1>
          <div style={buttonDivStyle}>
            <a href="/contact/create"><button style={buttonStyle}>
              Add Contact
            </button></a>
            <button onClick={this.toggleFilters.bind(this)} style={buttonStyle}>
              {this.state.showFilters ? "Hide" : "Filters"}
            </button>
          </div>
          {this.state.showFilters &&
          <div style={filtersStyle}>
            <div>
              <div>Search by name:</div>
              <input
                type="text"
                style={searchBarStyle}
                value={this.state.searchInput}
                placeholder="search by name"
                onChange={this.updateSearch.bind(this)}>
              </input>
            </div><br />
            <div>
              <div>Search by label:</div>
              <input
                type="text"
                style={searchBarStyle}
                value={this.state.labelInput}
                placeholder="search by label"
                onChange={this.updateLabel.bind(this)}>
              </input>
            </div><br />
            <div>
              <span>Filter by department: </span>
              <select
                value={this.state.selectedDepartmentName}
                onChange={this.updateDepartment.bind(this)}>
                  <option value="">All</option>
                  {this.state.departmentList.map(department => (
                    <Department {...department} />
                  ))}
              </select>
            </div>
          </div>
          }
          <ul>
          {filteredContacts
          .map(contact => (
              <div>
                <Contact {...contact} /><br />
              </div>
          ))}
          </ul>
        </div>}
      </div>
    );
  }
}

// Display a contact
function Contact(contact) {
  const { _id, contactName, email, phoneNumbers } = contact;
  const tdStyle = { textAlign: "left" };
  return (
    <div>
      <table>
        <tr><td style={tdStyle}>Name: {contactName}</td></tr>
        <tr><td style={tdStyle}>Email: {email}</td></tr>
        <tr><td style={tdStyle}>Phone Number: {phoneNumbers.mobile}</td></tr>
      </table>
      <a href={"/contact/profile/" + _id}><button>View Profile</button></a>
    </div>
  );
}

// Display a department for dropdown option
function Department(department) {
  const { _id, departmentName } = department;
  return (
    <option value={_id}>{departmentName}</option>
  )
}
