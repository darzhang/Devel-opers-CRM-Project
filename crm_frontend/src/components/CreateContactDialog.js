import React, { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from "@material-ui/core";

export default function CreateContactDialog({ isOpen, setContactDialog }) {

  const initialState = {
    contactName: "",
    phoneHome: "",
    phoneWork: "",
    phoneMobile: "",
    email: "",
    contactLabel: "",
    departmentName: "",
    organisationName: "",
    description: ""
  };

  const [state, setState] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);

  // handle the change for the states
  const onChange = (e) => {
    setSubmitted(false);
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  // handle submitting the data to the backend
  const onSubmit = (e) => {
    setSubmitted(true);
    e.preventDefault();
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    const url = BASE_URL + "/contact";
    const { contactName, phoneHome, phoneWork, phoneMobile, email, contactLabel, departmentName, organisationName, description } = state;
    axios.post(url, { contactName, phoneHome, phoneWork, phoneMobile, email, contactLabel, departmentName, organisationName, description }, {withCredentials:true})
    .then(() => {
      window.location = "/contact";
      handleClose();
      Swal.fire({
        title: "Successful",
        text: "Contact has been successfully created!",
        icon: "success",
        showClass: {
          icon: ''
        }
      })
    });
  };
  
  //close the handle and set the state to initial state
  const handleClose = () => {
    setContactDialog(false);
    setState(initialState);
    setSubmitted(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Create Contact</DialogTitle>
      <DialogContent>
        <Grid container>

          <Grid item xs={6}>
            <TextField
              type="text"
              label="Contact Name" 
              variant="outlined"
              name="contactName"
              value={state.contactName}
              onChange={onChange}
              required
              error={state.contactName === "" && submitted === true}
              helperText={state.contactName === "" && submitted === true ? 'Empty field!' : ' '}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="text"
              label="Mobile Phone Number" 
              variant="outlined"
              name="phoneMobile"
              value={state.phoneMobile}
              onChange={onChange}
              required
              error={state.phoneMobile === "" && submitted === true}
              helperText={state.phoneMobile === "" && submitted === true ? 'Empty field!' : ' '}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="text"
              label="Home Phone Number" 
              variant="outlined"
              name="phoneHome"
              value={state.phoneHome}
              onChange={onChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="text"
              label="Work Phone Number" 
              variant="outlined"
              name="phoneWork"
              value={state.phoneWork}
              onChange={onChange}
              error={false}
              helperText={false ? 'Empty field!' : ' '}
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              type="email"
              label="Email" 
              variant="outlined"
              name="email"
              value={state.email}
              onChange={onChange}
              required
              error={state.email === "" && submitted === true}
              helperText={state.email === "" && submitted === true ? 'Empty field!' : ' '}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="text"
              label="Label" 
              variant="outlined"
              name="contactLabel"
              value={state.contactLabel}
              onChange={onChange}
              required
              error={state.label === "" && submitted === true}
              helperText={state.label === "" && submitted === true ? 'Empty field!' : ' '}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="text"
              label="Department Name" 
              variant="outlined"
              name="departmentName"
              value={state.departmentName}
              onChange={onChange}
              required
              error={state.departmentName === "" && submitted === true}
              helperText={state.departmentName === "" && submitted === true ? 'Empty field!' : ' '}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="text"
              label="Organisation Name" 
              variant="outlined"
              name="organisationName"
              value={state.organisationName}
              onChange={onChange}
              required
              error={state.organisationName === "" && submitted === true}
              helperText={state.organisationName === "" && submitted === true ? 'Empty field!' : ' '}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              type="text"
              label="Description" 
              variant="outlined"
              name="description"
              value={state.description}
              onChange={onChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}