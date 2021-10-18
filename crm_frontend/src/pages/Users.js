import React, { useState } from "react";
import axios from 'axios';
// import { loginUser } from "../api";
import { withRouter } from "react-router-dom";
//import { response } from "../../../CRM_Backend/app";
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

// component to Logout user
export function Logout() {
  
  // remove token from the local storage
  sessionStorage.removeItem('token');
  // open the homepage --- example of how to redirect
  // another example
  
  
}

/*
  Generate a login form
*/
export function LoginForm({history}) {
  // state hook functions   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (sessionStorage.getItem("isAuthenticated") === "true"){
    history.push('./')
  }

  // const token = localStorage.getItem("token");
  // if (token !== null) {
  //     return (
  //         <div>You are logged in</div>
  //     )
  
  
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
        email: email,
        password: password
      },
      withCredentials: true,
      url: "https://developer-crm-backend.herokuapp.com/login"
    }).then((response) => {
      console.log(response)
      if (response.data){
        sessionStorage.setItem("isAuthenticated", "true")
        console.log('successful login');
        history.push('/')
      } 
      else {
        alert('Wrong email or password');
      }
    }).catch(error => {
      console.log('server error');
      console.log(error);
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
              Login
            </Typography>
            <br /> 
          </Grid>
          <Grid item style={{marginTop: "10%"}}>
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
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className="button-block"
                    onClick={onSubmit}
                    style={{textTransform: "none"}}
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
            <Link href="#" style={{fontSize: "16px"}}>
            Forgot Password?
            </Link>
            <br />
          </Grid>
          <Grid item>
            <Link href="/register" style={{fontSize: "16px"}}>
            Don't have an account? Register here.
            </Link>
          </Grid>
          </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}




      