import React, { useState } from "react";
import { loginUser } from "../api";
import { Redirect } from "react-router-dom";

// component to Logout user
export function Logout() {
  
  // remove token from the local storage
  localStorage.removeItem('token');

  // open the homepage --- example of how to redirect
  // another example
  const state = { redirect: "/" };
  return <Redirect to={state.redirect} />
  
}

/*
  Generate a login form
*/
export function LoginForm() {
  // state hook functions   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");
  if (token !== null) {
      return (
          <div>You are logged in</div>
      )
  }
  
  // submit form
  function onSubmit(e) {
      e.preventDefault();
      // using API function to submit data to Personal CRM API
      loginUser({
          email: email,
          password: password
      });

      // redirect to homepage
      const state = { redirect: "/" };
      return <Redirect to={state.redirect} />
  }
  return (
      <div>
          <h1>CUSTOMER LOGIN</h1>
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
              <input type="submit" value="Login" onClick={onSubmit}/>
                  
              
          </form>
      </div>
      
  );
}