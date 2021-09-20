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
import ContactProfile from "./pages/ContactProfile";
import CreateContact from "./pages/CreateContact";
import Events from './pages/Event/Events';
import EventDetails from './pages/Event/EventDetails';

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);

  const mainComponent = (
    <div className="App">
      <Router>
        {/* <SideBar /> */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/contact" component={Contacts} />
          <Route exact path="/contact/create" component={CreateContact} />
          <Route exact path="/contact/profile/:id" component={ContactProfile} />
          <Route exact path="/event/" component={Events} />
          <Route exact path="/event/:id" component={EventDetails} />
        </Switch>
      </Router>
    </div>
  )

  const loginPage = <LoginForm setLoggedIn={setLoggedIn}/>

  return mainComponent;
}

export default App;
