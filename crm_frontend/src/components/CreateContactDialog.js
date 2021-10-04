import React, { useState } from "react";
import axios from "axios";
import Alert from '@mui/material/Alert';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

export default function CreateContactDialog({ isOpen, setContactDialog }) {

  const history = useHistory();

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

  // handle the change for the states
  const onChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  // handle submitting the data to the backend
  const onSubmit = (e) => {
    e.preventDefault();
    const BASE_URL = "http://localhost:5000";
    const url = BASE_URL + "/contact";
    const { contactName, phoneHome, phoneWork, phoneMobile, email, contactLabel, departmentName, organisationName, description } = state;
    axios.post(url, { contactName, phoneHome, phoneWork, phoneMobile, email, contactLabel, departmentName, organisationName, description })
    .then(() => {
      history.push("/contact");
      handleClose();
      alert("success created contact")
    });
  };

  const handleClose = () => {
    setContactDialog(false);
    setState(initialState);
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
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="text"
              label="Email" 
              variant="outlined"
              name="email"
              value={state.email}
              onChange={onChange}
              required
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