import React, { useState, useEffect } from "react";
import DataGridComp from '../components/Event/DataGridComp';
import CircularProgress from '@mui/material/CircularProgress';
import Button from "@material-ui/core/Button";
import axios from "axios";

export default function OrganisationDetail(props) {
  const [organisation, setOrganisation] = useState([]);
  const [contact, setContact] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /*get the organisation list from the database*/
    const BASE_URL ="https://developer-crm-backend.herokuapp.com/organisation/" + props.match.params.id;
    axios.get(BASE_URL, {withCredentials: true})
      .then((data) => data.data)
      .then((data) => {
        setOrganisation(data);
        getContacts(data[0]);
      });
  }, []);

  /* Get list of departments from the Backend
   */
  const getDepartments = async () => {
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    const res = await axios.get(BASE_URL + "/department", {withCredentials: true})
    setDepartmentList(res.data);
    let depList = res.data
    return depList;
  }

  /* Get list of contacts from the Backend and display them in an alphabetically sorted order
   */
  const getContacts = async (org) => {
    const deps = await getDepartments();
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    await axios.get(BASE_URL + "/contact", {withCredentials: true}).then(res => {
        const list = res.data;
        const sortedList = list.sort((a, b) => (a.contactName > b.contactName) ? 1 : -1)
        // console.log(sortedList);
        // console.log(org);
        const filteredList = sortedList.filter((c) => c.organisationId === org._id)
        filteredList.forEach(async (contact) => {
          contact.id = contact._id;
          contact.phoneMobile = contact.phoneNumbers.mobile;
          const department = deps.filter(department => department._id === contact.departmentId);
          contact.departmentName = department[0].departmentName;
          contact.organisationName = org.orgName;
        })
        setContact(filteredList);
        setIsLoading(false);
    })
  }

  //this function render the show detail button that when clicked will take the user to 
  //contact detail page
  const showDetailColumn = {
    width: 120,
    field:'showDetail',
    headerName: 'Detail',
    filterable:false,
    flex: 1,
    renderCell: (contact) => {
      return (
        <a href={"/contact/profile/" + contact.id} style={{textDecoration: "none", textAlign: "center"}}>
          <Button variant="contained" style={{textTransform: "none"}}>
            View Contact
          </Button>
        </a>
      );
    }
  }

  const columns = [
    { field: 'contactName', headerName: 'Contact Name', minWidth: 160, flex: 1},
    { field: 'email', headerName: 'Email', minWidth: 160, flex: 1, filterable:false},
    { field: 'phoneMobile', headerName: 'Phone Number', minWidth: 160, flex: 1, filterable:false},
    { field: 'label', headerName: 'Label', minWidth: 160, flex: 1},
    { field: 'departmentName', headerName: 'Department Name', minWidth: 160, flex: 1},
    { field: 'organisationName', headerName: 'Organisation Name', minWidth: 160, flex: 1},
    showDetailColumn
  ];

  const fields = ['contactName', 'email', 'phoneMobile', 'label', 'departmentName', 'organisationName'];

  const marginStyle = { marginTop: "2%", marginLeft: "5%" };

  return (
    <div style={marginStyle}>
      {isLoading && <CircularProgress />}
      {!isLoading &&
      <div>
        {organisation.map((org) => {
          return (
            <div>
              <h1>{org.orgName}</h1>
            </div>
          ); 
        })}
        <h1>Contact List</h1>
      </div>
      }
      <div className="listOfEvents">
          {!isLoading ? <DataGridComp events={contact} columns={columns} fields={fields}></DataGridComp> : <></>}
      </div>
    </div>
  );
}
