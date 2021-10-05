import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import DataGridComp from '../components/Event/DataGridComp';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

export default function Organisation() {
  const [organisations, setOrganisations] = useState([]);
  const [contact, setContact] = useState([]);

  useEffect(() => {
    /*get the organisation list from the database*/
    fetch("http://localhost:5000/organisation")
      .then((data) => data.json())
      .then((data) => {
        data.forEach( async (org) =>{ 
          org.id = org._id;
        })
        getContacts();
        getOrgSize(data);
        setOrganisations(data);
      });
  }, [contact]);

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

  const getContacts = async () => {
    const BASE_URL = "http://localhost:5000";
    await axios.get(BASE_URL + "/contact").then(res => {
      const list = res.data;
      setContact(list);
    })
  }

  async function getOrgSize(organisation){
    organisation.forEach(async (org) =>{
      const orgSize = contact.filter((c) => c.organisationId === org._id).length;
      org.size = orgSize;
    });
  }

  const columns = [
    { field: 'orgName', headerName: 'Organisation Name', minWidth: 160, flex: 1},
    { field: 'size', headerName: 'Network Size', minWidth: 160, flex: 1, filterable:false},
    showDetailColumn
  ];

  const marginStyle = { marginTop: "2%", marginLeft: "5%" };

  return (
    <div style={marginStyle}>
      <h1>
        Organisation List
      </h1>
      <div className="listOfEvents">
          {organisations.length > 0 ? <DataGridComp events={organisations} columns={columns}></DataGridComp> : <CircularProgress />}
      </div>
    </div>
  )
}
