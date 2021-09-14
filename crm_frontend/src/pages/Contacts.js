import axios from "axios";
import React, { useState, useEffect } from "react";

export default function Contacts() {
  // useState hooks
  const [contactList, setContactList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // load the data when loading the page
  useEffect(() => {
    getContacts();
    getDepartments();
    setIsLoading(false);
  }, [])

  // get list of contacts from the database and display them in an alphabetically sorted order
  const getContacts = async () => {
    const BASE_URL = "http://localhost:5000";
    await axios.get(BASE_URL + "/contact").then(res => {
        const list = res.data;
        const sortedList = list.sort((a, b) => (a.contactName > b.contactName) ? 1 : -1)
        setContactList(sortedList);
    })
  }

  // get list of departments from the database
  const getDepartments = async () => {
    const BASE_URL = "http://localhost:5000";
    await axios.get(BASE_URL + "/department").then(res => {
      setDepartmentList(res.data);
    })
  }

  // toggle function for filter button
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  }

  // change search result based on contact name
  const updateSearch = (e) => {
    setSearchInput(e.target.value.substr(0));
  }

  // change search result based on label
  const updateLabel = (e) => {
    setLabelInput(e.target.value.substr(0));
  }

  // change search result based on the selected department
  const updateDepartment = (e) => {
    setSelectedDepartmentId(e.target.value);
    setSelectedDepartmentName(e.target.text);
  }

  // reset the filters
  const clearFilters = () => {
    setSearchInput("");
    setLabelInput("");
    setSelectedDepartmentId(null);
    setSelectedDepartmentName("");
  }

  // Filter by name
  let filteredContacts = contactList.filter(contact => {
    return contact.contactName.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1;
  });

  // Filter by label
  filteredContacts = filteredContacts.filter(contact => {
    return contact.label.toLowerCase().indexOf(labelInput.toLowerCase()) !== -1;
  })

  // Filter by department
  filteredContacts = filteredContacts.filter(contact => {
    if (selectedDepartmentName === "" || selectedDepartmentId === "") {
      return true
    }
    return contact.departmentId === selectedDepartmentId;
  })

  // styles
  const searchBarStyle = {width: "20rem", background: "#F2F1F9", border: "none", padding: "0.5rem"};
  const filtersStyle = { textAlign: "left", marginLeft: "43px" };
  const buttonDivStyle = { textAlign: "right", marginRight: "43px" };
  const buttonStyle = { padding: "10px", fontSize: "16px", borderRadius: "4px", width: "120px" }
  const loadingStyle = { fontSize: "36px" };
  const marginStyle = { marginTop: "100px", marginLeft: "80px" };

  return (
    <div style={marginStyle}>
      {isLoading &&
      <div style={loadingStyle}>
          Loading...
      </div>}
      {!isLoading &&
      <div>
        <h1>Contact List</h1>
        <div style={buttonDivStyle}>
          <a href="/contact/create"><button style={buttonStyle}>
            Add Contact
          </button></a>
          <button onClick={toggleFilters} style={buttonStyle}>
            {showFilters ? "Hide" : "Filters"}
          </button>
        </div>
        {showFilters &&
        <div style={filtersStyle}>
          <div>
            <div>Search by name:</div>
            <input
              type="text"
              style={searchBarStyle}
              value={searchInput}
              placeholder="search by name"
              onChange={updateSearch}>
            </input>
          </div><br />
          <div>
            <div>Search by label:</div>
            <input
              type="text"
              style={searchBarStyle}
              value={labelInput}
              placeholder="search by label"
              onChange={updateLabel}>
            </input>
          </div><br />
          <div>
            <span>Filter by department: </span>
            <select
              value={selectedDepartmentName}
              onChange={updateDepartment}>
                <option value="">All</option>
                {departmentList.map(department => (
                  <Department {...department} />
                ))}
            </select>
          </div>
          <div style={buttonDivStyle}>
            <button onClick={clearFilters} style={buttonStyle}>
              Clear Filters
            </button>
          </div>
        </div>
        }
        <ul>
        {filteredContacts
        .map((contact, i) => (
            <div key={i}>
              <Contact {...contact} /><br />
            </div>
        ))}
        </ul>
      </div>}
    </div>
  )
}

// Display a contact
function Contact(contact) {
  const { _id, contactName, email, phoneNumbers } = contact;
  const tdStyle = { textAlign: "left" };
  return (
    <div>
      <table>
        <tbody>
          <tr><td style={tdStyle}>Name: {contactName}</td></tr>
          <tr><td style={tdStyle}>Email: {email}</td></tr>
          <tr><td style={tdStyle}>Phone Number: {phoneNumbers.mobile}</td></tr>
        </tbody>
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