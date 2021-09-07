import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import our components
// import Nav from "./components/Nav";
import SideBar from "./components/sidebar";
import Home from "./pages/Home";
import { LoginForm, Logout  } from "./pages/Users";
import Contacts from "./pages/Contacts";

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);

  const mainComponent = (
    <div className="App">
      <Router>
        <SideBar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/contact" component={Contacts} />
        </Switch>
      </Router>
    </div>
  )

  const loginPage = <LoginForm setLoggedIn={setLoggedIn}/>

  return mainComponent;
}

export default App;
