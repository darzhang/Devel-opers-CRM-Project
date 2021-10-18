import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import DataGridComp from '../components/Event/DataGridComp';
import CircularProgress from '@mui/material/CircularProgress';
import CreateContactDialog from "../components/CreateContactDialog";

/* Display a contact list page
 */
export default function Contacts() {
  // useState hooks
  const [contactList, setContactList] = useState([]);
  const [createContactDialog, setCreateContactDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from the Backend when loading the page
  useEffect(() => {
    getContacts();
  }, [])

  /* Get list of contacts from the Backend and display them in an alphabetically sorted order
   */
  const getContacts = async () => {
    const deps = await getDepartments();
    const orgs = await getOrganisations();
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    await axios.get(BASE_URL + "/contact", {withCredentials: true}).then(res => {
        const list = res.data;
        const sortedList = list.sort((a, b) => (a.contactName > b.contactName) ? 1 : -1)
        sortedList.forEach(async (contact) => {
          contact.id = contact._id;
          contact.phoneMobile = contact.phoneNumbers.mobile;
          const department = deps.filter(department => department._id === contact.departmentId);
          contact.departmentName = department[0].departmentName;
          const organisation = orgs.filter(organisation => organisation._id === contact.organisationId);
          contact.organisationName = organisation[0].orgName;
        })
        setContactList(sortedList);
        setIsLoading(false);
    })
  }

  let depList = []
  /* Get list of departments from the Backend
   */
  const getDepartments = async () => {
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    const res = await axios.get(BASE_URL + "/department", {withCredentials: true});
    depList = res.data;
    return depList;
  }

  let orgList = []
  /* Get list of organisations from the Backend
   */
  const getOrganisations = async () => {
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    const res = await axios.get(BASE_URL + "/organisation", {withCredentials: true});
    orgList = res.data;
    return orgList;
  }

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

  // Styles
  const buttonDivStyle = { textAlign: "right", marginRight: "1%" };
  const marginStyle = { marginTop: "2%", marginLeft: "5%" };

  return (
    <div>
      <CreateContactDialog 
        isOpen={createContactDialog}
        setContactDialog={setCreateContactDialog}
      />
      <div style={marginStyle}>
        {isLoading &&
        <div>
          <h1>Contacts</h1>
        </div>}
        {!isLoading &&
        <div>
          <h1>Contacts</h1>
          <div style={buttonDivStyle}>
            <Button variant="contained" style={{textTransform: "none", marginRight: "1%"}} onClick={() => setCreateContactDialog(true)}>
              Add Contact
            </Button>
          </div><br />
        </div>
        }
        <div className="listOfEvents">
          {!isLoading ? <DataGridComp events={contactList} columns={columns} fields={fields}></DataGridComp> : <CircularProgress />}
        </div><br />
      </div>
    </div>
  )
}