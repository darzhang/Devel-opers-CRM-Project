import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import our components
// import Nav from "./components/Nav";
import SideBar from "./components/sidebar";
import Organisation from './pages/Organisation';
import OrganisationDetail from './pages/OrganisationDetail';
import Home from "./pages/Home";
import { LoginForm, Logout  } from "./pages/Users";
import Contacts from "./pages/Contacts";
import ContactProfile from "./pages/ContactProfile";
import ProfilePage from "./pages/ProfilePage";
import Events from './pages/Event/Events';
import EventDetails from './pages/Event/EventDetails';
import Calendar from './pages/Event/Calendar';
import {RegisterForm} from './pages/Register';
import ProtectedRoute from './components/ProtectedRoutes';
import Profile from './pages/ProfilePage';

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);
  const mainComponent = (
    <div className="App">
      <Router>
        <Switch>
         <Route exact path="/login" component={LoginForm} />
         <Route exact path="/register" component={RegisterForm} />
        <div>
        <SideBar />
          <Switch>
            <ProtectedRoute exact path="/">
              <Home />
            </ProtectedRoute>
            <ProtectedRoute exact path="/logout" component={Logout} />
            <ProtectedRoute exact path="/profile" component={Profile} />
            <ProtectedRoute exact path="/contact" component={Contacts} />
            <ProtectedRoute exact path="/organisation" component={Organisation} />
            <ProtectedRoute exact path="/organisation/:id" component={OrganisationDetail} />
            <ProtectedRoute exact path="/contact/profile/:id" component={ContactProfile} />
            <ProtectedRoute exact path="/profile" component={ProfilePage} />
            <ProtectedRoute exact path="/event/" component={Events} />
            <ProtectedRoute exact path="/event/:id" component={EventDetails} />
            <ProtectedRoute exact path="/calendar" component={Calendar} />
          </Switch>
        </div>  
        </Switch>
      </Router>
    </div>
  )

  const loginPage = <LoginForm setLoggedIn={setLoggedIn}/>

  return mainComponent;
}

export default App;
