import React from "react";
import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav>
      <NavLink exact to="/">
        Home
      </NavLink>
      &nbsp;|&nbsp;
      <NavLink to="/login">Login</NavLink>
      &nbsp;|&nbsp;  
      <NavLink to="/logout">Logout</NavLink>
      &nbsp;|&nbsp;  
      <NavLink to="/contact">Contacts</NavLink>
      <br></br>
      <hr></hr>
    </nav>
  );
}