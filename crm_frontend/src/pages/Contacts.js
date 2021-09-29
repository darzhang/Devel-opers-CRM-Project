import axios from "axios";
import React, { useState, useEffect } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@mui/material/FormControl';
import TablePagination from "@material-ui/core/TablePagination";
import CreateContactDialog from "../components/CreateContactDialog";

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

  // Display a contact
  const row = (contact, i) => (
    <TableRow key={i}>
      <TableCell>{contact.contactName}</TableCell>
      <TableCell>{contact.email}</TableCell>
      <TableCell>{contact.phoneNumbers.mobile}</TableCell>
      <TableCell align="center">
        <a href={"/contact/profile/" + contact._id} style={{textDecoration: "none"}}>
          <Button variant="contained" style={{textTransform: "none"}}>
            View Contact
          </Button>
        </a>
      </TableCell>
    </TableRow>
  )

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, contactList.length - page * rowsPerPage);

  // styles
  const filtersStyle = { textAlign: "left" };
  const buttonDivStyle = { textAlign: "right", marginRight: "5%" };
  const loadingStyle = { fontSize: "36px" };
  const marginStyle = { marginTop: "6%", marginLeft: "10%" };

  return (
    <>
      <CreateContactDialog 
        isOpen={createContactDialog}
        setContactDialog={setCreateContactDialog}
      />
      <div style={marginStyle}>
        {isLoading &&
        <div style={loadingStyle}>
          Loading...
        </div>}
        {!isLoading &&
        <div>
          <h1 style={{marginRight: "12%"}}>Contact List</h1>
          <div style={buttonDivStyle}>
            <Button variant="contained" style={{textTransform: "none", marginRight: "1%"}} onClick={() => setCreateContactDialog(true)}>
              Add Contact
            </Button>
            <Button variant="contained" onClick={toggleFilters} style={{textTransform: "none", minWidth: "80px"}}>
              {showFilters ? "Hide" : "Filters"}
            </Button>
          </div><br />
          {showFilters &&
          <div style={filtersStyle}>
            <div>
              <div>Search by name:</div>
              <TextField
                type="text"
                variant="outlined"
                size="small"
                style={{marginTop: "1%", minWidth: "250px"}}
                value={searchInput}
                placeholder="search by name"
                onChange={updateSearch}>
              </TextField>
            </div><br />
            <div>
              <div>Search by label:</div>
              <TextField
                type="text"
                variant="outlined"
                size="small"
                style={{marginTop: "1%", minWidth: "250px"}}
                value={labelInput}
                placeholder="search by label"
                onChange={updateLabel}>
              </TextField>
            </div><br />
            <div>
              <div>Filter by department: </div>
              <FormControl variant="outlined" size="small" style={{marginTop: "1%", minWidth: "150px"}}>
                <Select
                  value={selectedDepartmentId}
                  onChange={updateDepartment}>
                  <MenuItem value="">All</MenuItem>
                  {departmentList.map((department, i) => (
                    <MenuItem value={department._id} key={i}>{department.departmentName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div style={buttonDivStyle}>
              <Button variant="contained" onClick={clearFilters} style={{textTransform: "none"}}>
                Clear Filters
              </Button>
            </div><br />
          </div>
          }
          <TableContainer component={Paper} style={{width: "95%"}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{fontWeight: "bold"}}>Name</TableCell>
                  <TableCell style={{fontWeight: "bold"}}>Email</TableCell>
                  <TableCell style={{fontWeight: "bold"}}>Phone Number</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContacts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((contact, i) => row(contact, i))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 69.4 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {filteredContacts.length === contactList.length &&
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={contactList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />}
          </TableContainer><br />
        </div>}
      </div>
    </>
  )
}