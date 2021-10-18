import axios from "axios";
import React, { useState, useEffect} from "react";
import { useHistory } from "react-router-dom";

export default function CreateContact ({props}) {

  const [state, setState] = useState({
    contactName: "",
    phoneHome: "",
    phoneWork: "",
    phoneMobile: "",
    email: "",
    contactLabel: "",
    departmentName: "",
    organisationName: "",
    description: ""
  });
  const [isLoading, setisLoading] = useState(false);

  // constants
  const loadingStyle = { fontSize: "36px" };
  const backStyle = { fontSize: "16px", textDecoration: "none" };
  const backDivStyle = { textAlign: "left", marginLeft: "20px" };
  let history = useHistory();
  
  // handle the change for the states
  const onChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  }

  // handle submitting the data to the backend
  const onSubmit = (e) => {
    e.preventDefault();
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    const url = BASE_URL + "/contact";
    const { contactName, phoneHome, phoneWork, phoneMobile, email, contactLabel, departmentName, organisationName, description } = this.state;
    axios.post(url, {phoneHome, phoneWork, phoneMobile, email, contactLabel, departmentName, organisationName, descriptionCredentials: true}, {withCredentials: true})
    .then(() => {
      history.push("/contact");
      alert("Contact was successfully created!")
    });
  };

  return (
    <>
      {isLoading &&
        <div style={loadingStyle}>
          Loading...
        </div>
      }
      {!isLoading &&
        <div>
        <div style={backDivStyle}><a href="/contact"><span style={backStyle}>Back</span></a></div>
        <h1>Create Contact</h1>
        <form onSubmit={onSubmit}>
            <label>Name </label>
            <input
              type="text"
              name="contactName"
              value={state.contactName}
              onChange={onChange}
              required
            /><br />

            <label>Home Phone Number </label>
            <input
              type="text"
              name="phoneHome"
              value={state.phoneHome}
              onChange={onChange}
            /><br />

            <label>Work Phone Number </label>
            <input
              type="text"
              name="phoneWork"
              value={state.phoneWork}
              onChange={onChange}
            /><br />

            <label>Mobile Phone Number </label>
            <input
              type="text"
              name="phoneMobile"
              value={state.phoneMobile}
              onChange={onChange}
              required
            /><br />

            <label>Email </label>
            <input
              type="text"
              name="email"
              value={state.email}
              onChange={onChange}
              required
            /><br />

            <label>Label </label>
            <input
              type="text"
              name="contactLabel"
              value={state.contactLabel}
              onChange={onChange}
              required
            /><br />

            <label>Department Name </label>
            <input
              type="text"
              name="departmentName"
              value={state.departmentName}
              onChange={onChange}
              required
            /><br />

            <label>Organisation Name </label>
            <input
              type="text"
              name="organisationName"
              value={state.organisationName}
              onChange={onChange}
              required
            /><br />

            <label>Description </label>
            <textarea
              name="description"
              value={state.description}
              onChange={onChange}
            /><br />

            <button type="submit">Submit</button>
        </form>
        </div>
      }
    </>
  )
}