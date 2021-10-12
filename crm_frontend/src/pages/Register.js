import React, { useState } from "react";
import axios from 'axios';

// import { loginUser } from "../api";
import { withRouter } from "react-router-dom";
//import { response } from "../../../CRM_Backend/app";


/*
  Generate a login form
*/
export function RegisterForm({history}) {

  if (sessionStorage.getItem("isAuthenticated") === "true"){
    history.push('./')
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
      url: "http://localhost:5000/register"
    }).then((response) => {
      if (response.data){
        console.log('successful login');
       
        sessionStorage.setItem("isAuthenticated", "true")
        history.push('/')
      } 
      else {
        alert('email existing');
      }
    }).catch(error => {
      console.log('server error');
      console.log(error);
    })

    
  }
  return (
      <div>
          <h1>CUSTOMER REGISTER</h1>
          <form method= "post" action="/login">
              <input
                  type="text"
                  name="email"
                  id="email"                
                  value={email}
                  placeholder="email"  
                  onChange={event => {
                    setEmail(event.target.value);
                  }}                  
              />
              <input
                  type="password"
                  name="password"
                  id="password"                
                  value={password}
                  placeholder="************"
                  onChange={event => {
                    setPassword(event.target.value);
                  }}                      
              />
              <input
                  type="username"
                  name="username"
                  id="username"                
                  value={username}
                  placeholder="username"
                  onChange={event => {
                    setUsername(event.target.value);
                  }}                      
              />
              <input type="submit" value="Register" onClick={onSubmit}/>
                  
              
          </form>
      </div>
      
  );
}

