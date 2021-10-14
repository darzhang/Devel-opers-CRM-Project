import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import DataGridComp from '../components/Event/DataGridComp';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

export default function Organisation() {
  const [organisations, setOrganisations] = useState([]);
  const [contact, setContact] = useState([]);

  useEffect(() => {
    if (contact.length > 0) {
      /*get the organisation list from the database*/
      axios.get("http://localhost:5000/organisation", {withCredentials: true})
        .then((data) => data.data)
        .then((data) => {
          const mappedData = data.map(org =>{
            const orgSize = contact.filter((c) => c.organisationId === org._id).length;
            return {
              ...org,
              id: org._id,
              size: orgSize
            }
          });
          setOrganisations(mappedData);
        });
    }
  }, [contact]);

  useEffect(() => {
    const BASE_URL = "http://localhost:5000";
    axios.get(BASE_URL + "/contact", {withCredentials:true}).then(res => {
      const list = res.data;
      setContact(list);
    })
  }, [])
  
  const showDetailColumn = {
    width: 120,
    field:'showDetail',
    headerName: 'Detail',
    filterable:false,
    flex: 1,
    renderCell: (org) => {
      return (
        <a href={"/organisation/" + org.id} style={{textDecoration: "none", textAlign: "center"}}>
          <Button variant="contained" style={{textTransform: "none"}}>
            View Detail
          </Button>
        </a>
      );
    }
  }

  // const getContacts = async () => {
  //   const BASE_URL = "http://localhost:5000";
  //   await axios.get(BASE_URL + "/contact").then(res => {
  //     const list = res.data;
  //     setContact(list);
  //   })
  // }

  const columns = [
    { field: 'orgName', headerName: 'Organisation Name', minWidth: 160, flex: 1},
    { field: 'size', headerName: 'Network Size', minWidth: 160, flex: 1, filterable:false},
    showDetailColumn
  ];

  const fields = ['orgName', 'size'];

  const marginStyle = { marginTop: "2%", marginLeft: "5%" };

  return (
    <div style={marginStyle}>
      <h1>
        Organisation List
      </h1>
      <div className="listOfEvents">
          {organisations.length > 0 ? <DataGridComp events={organisations} columns={columns} fields={fields}></DataGridComp> : <CircularProgress />}
      </div>
    </div>
  )
}
