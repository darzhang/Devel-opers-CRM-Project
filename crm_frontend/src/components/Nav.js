import React from "react";
import { useHistory } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';

export default function Nav() {

  const history = useHistory();

  return (
    <AppBar>
      <Toolbar>
        <IconButton color="inherit" onClick={() => history.push('/')}>
          Home
        </IconButton>
        <IconButton color="inherit" onClick={() => history.push('/login')}>
          Login
        </IconButton>
        <IconButton color="inherit" onClick={() => history.push('/logout')}>
          Logout
        </IconButton>
        <IconButton color="inherit" onClick={() => history.push('/contact')}>
          Contacts
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}