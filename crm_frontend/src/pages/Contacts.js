import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@mui/material/FormControl';
import DataGridComp from '../components/Event/DataGridComp';
import { getGridNumericColumnOperators } from "@mui/x-data-grid";
import CircularProgress from '@mui/material/CircularProgress';
import TablePagination from "@material-ui/core/TablePagination";
import CreateContactDialog from "../components/CreateContactDialog";

/* Display a contact list page
 */
export default function Contacts() {
  // useState hooks
  const [contactList, setContactList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [createContactDialog, setCreateContactDialog] = useState(false);

  // Load data from the Backend when loading the page
  useEffect(() => {
    getContacts();
  }, [])

  /* Get list of contacts from the Backend and display them in an alphabetically sorted order
   */
  const getContacts = async () => {
    const deps = await getDepartments();
    const orgs = await getOrganisations();
    const BASE_URL = "http://localhost:5000";
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
    })
  }

  let depList = []
  /* Get list of departments from the Backend
   */
  const getDepartments = async () => {
    const BASE_URL = "http://localhost:5000";
    const res = await axios.get(BASE_URL + "/department", {withCredentials: true})
    setDepartmentList(res.data);
    depList = res.data;
    return depList;
  }

  let orgList = []
  /* Get list of organisations from the Backend
   */
  const getOrganisations = async () => {
    const BASE_URL = "http://localhost:5000";
    const res = await axios.get(BASE_URL + "/organisation", {withCredentials: true})
    orgList = res.data;
    return orgList;
  }

  /* Toggle show or hide filters when the button is clicked
   */
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  }

  /* Change search result based on the letters typed in the search by name text field
   *
   * @param e Event
   */
  const updateSearch = (e) => {
    setSearchInput(e.target.value.substr(0));
  }

  /* Change search result based on the letters typed in the search by label text field
   * @param e Event
   */
  const updateLabel = (e) => {
    setLabelInput(e.target.value.substr(0));
  }

  /* Change search result based on the selected department from the filter by department dropdown
   *
   * @param e Event
   */
  const updateDepartment = (e) => {
    if (e.target.nodeName === 'BODY' && e.type === 'click') {
      return;
    }
    setSelectedDepartmentId(e.target.value);
    setSelectedDepartmentName(e.target.text);
  }

  /* Reset all filters (search by name and label to empty string, and selected department to null)
   */
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

  // const departmentDropdown = () => (
  //   <FormControl variant="standard">
  //     <Select
  //       value={selectedDepartmentId}
  //       onChange={updateDepartment}>
  //       <MenuItem value="">All</MenuItem>
  //       {departmentList.map((department, i) => (
  //         <MenuItem value={department._id} key={i}>{department.departmentName}</MenuItem>
  //       ))}
  //     </Select>
  //   </FormControl>
  // )

  // const labelTextField = () => (
  //   <TextField
  //     type="text"
  //     variant="standard"
  //     size="small"
  //     style={{marginTop: "1%", minWidth: "250px"}}
  //     value={labelInput}
  //     placeholder="search by label"
  //     onChange={updateLabel}>
  //   </TextField>
  // )

  // if (columns.length > 0) {
  //   const departmentColumn = columns.find((column) => column.field === 'departmentName');
  //   const departmentColIndex = columns.findIndex((col) => col.field === 'departmentName');

  //   const departmentFilterOperators = getGridNumericColumnOperators().map(
  //     (operator) => ({
  //       ...operator,
  //       InputComponent: departmentDropdown
  //     }),
  //   );

  //   columns[departmentColIndex] = {
  //     ...departmentColumn,
  //     filterOperators: departmentFilterOperators,
  //   };

  //   const labelColumn = columns.find((column) => column.field === 'label');
  //   const labelColIndex = columns.findIndex((col) => col.field === 'label');

  //   const labelFilterOperators = getGridNumericColumnOperators().map(
  //     (operator) => ({
  //       ...operator,
  //       InputComponent: labelTextField
  //     }),
  //   );

  //   columns[labelColIndex] = {
  //     ...labelColumn,
  //     filterOperators: labelFilterOperators,
  //   };
  // }

  // Styles
  const filtersStyle = { textAlign: "left" };
  const buttonDivStyle = { textAlign: "right", marginRight: "1%" };
  const loadingStyle = { fontSize: "36px" };
  const marginStyle = { marginTop: "2%", marginLeft: "5%" };

  return (
    <div>
      <CreateContactDialog 
        isOpen={createContactDialog}
        setContactDialog={setCreateContactDialog}
      />
      <div style={marginStyle}>
        {filteredContacts.length === 0 &&
        <div>
          <h1 style={{marginRight: "10%"}}>Contacts</h1>
        </div>}
        {filteredContacts.length > 0 &&
        <div>
          <h1 style={{marginRight: "10%"}}>Contacts</h1>
          <div style={buttonDivStyle}>
            <Button variant="contained" style={{textTransform: "none", marginRight: "1%"}} onClick={() => setCreateContactDialog(true)}>
              Add Contact
            </Button>
          </div><br />
        </div>
        }
        <div className="listOfEvents">
          {filteredContacts.length > 0 ? <DataGridComp events={contactList} columns={columns}></DataGridComp> : <CircularProgress />}
        </div><br />
      </div>
    </div>
  )
}