import React, { useState } from "react";
import axios from 'axios';
import {
  Button,
  TextField,
  Grid,
  Paper,
  AppBar,
  Typography,
  Toolbar,
  Link,
  } from "@material-ui/core";
import Swal from 'sweetalert2'

// import { loginUser } from "../api";
import { withRouter } from "react-router-dom";
//import { response } from "../../../CRM_Backend/app";


/*
  Generate a login form
*/
export function RegisterForm({history}) {

  if (sessionStorage.getItem("isAuthenticated") === "true"){
    history.push('./login')
  }
  // state hook functions   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

//   const token = localStorage.getItem("token");
//   if (token !== null) {
//       return (
//           <div>You are logged in</div>
//       )
//   }
  
  // submit form
  function onSubmit(e) {
    e.preventDefault();
    // using API function to submit data to Personal CRM API
    // loginUser({
    //     email: email,
    //     password: password
    // });
    axios({
      method: "POST",
      data: {
        username: username,
        email: email,
        password: password
      },
      withCredentials: true,
      url: "https://developer-crm-backend.herokuapp.com/register"
    }).then((response) => {
      if (response.data){
        sessionStorage.setItem("isAuthenticated", "true")
        Swal.fire({
          title: "Successfully Logged In!",
          icon: "success",
          showClass: {
            icon: ''
          },
          timer: 1000,
          showConfirmButton: false
        }).then(()=>{history.push('/')})
      } 
      else {
        Swal.fire({
          title: "Registration Error!",
          text: "Please try again.",
          icon: "warning",
          showClass: {
            icon: ''
          },
        })
      }
    }).catch(error => {
      Swal.fire({
        title: "Server Error!",
        icon: "warning",
        showClass: {
          icon: ''
        },
        timer: 1400,
        showConfirmButton: false
      })
    })

    
  }
  return (
    <div>
    <AppBar position="static" alignitems="center" color="primary">
      <Toolbar>
        <Grid container justify="center" wrap="wrap">
          <Grid item>
            <Typography variant="h6">DEVELOPERS CRM</Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
    <Grid container spacing={5} justify="center" direction="row">
      <Grid item>
        <Grid
          container
          direction="column"
          justify="center"
          spacing={2}
          className="login-form"
        >
        <Paper
          variant="elevation"
          elevation={2}
          className="login-background"
        >
        <Grid item>
          <Typography component="h1" variant="h3">
            Register
          </Typography>
          <br />
        </Grid>
        <Grid item>
          <form method= "post" action="/login">
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <TextField
                  type="text"
                  placeholder="Email"
                  fullWidth
                  name="email"
                  id = "email"
                  variant="outlined"
                  onChange={event => {
                    setEmail(event.target.value);
                  }}   
                  required
                  autoFocus
                />
              </Grid>
              <Grid item>
                <TextField
                  type="password"
                  id = "password"
                  placeholder="Password"
                  fullWidth
                  name="password"
                  variant="outlined"
                  onChange={event => {
                    setPassword(event.target.value);
                  }} 
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  type="username"
                  id = "username"
                  placeholder="Name"
                  fullWidth
                  name="username"
                  variant="outlined"
                  onChange={event => {
                    setUsername(event.target.value);
                  }}
                  required
                />
              </Grid>
              <Grid item>
                <Button
                variant="contained"
                color="primary"
                type="submit"
                className="button-block"
                onClick={onSubmit}
                >
                  Submit
                </Button>
                <br />
                <br />
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item>
          <Link href="/login" variant="h6">
          Have an account? Login here.
          </Link>
        </Grid>
        </Paper>
        </Grid>
      </Grid>
    </Grid>
  </div>
      
  );
}

