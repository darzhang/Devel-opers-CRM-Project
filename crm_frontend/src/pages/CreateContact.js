import axios from "axios";
import React, { Component } from "react";

export default class CreateContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactName: "",
      phoneHome: "",
      phoneWork: "",
      phoneMobile: "",
      email: "",
      contactLabel: "",
      departmentName: "",
      organisationName: "",
      description: ""
    };
  }

  // handle the change for the states
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // handle submitting the data to the backend
  onSubmit(e) {
    e.preventDefault();
    const BASE_URL = "http://localhost:5000";
    const url = BASE_URL + "/contact";
    const { contactName, phoneHome, phoneWork, phoneMobile, email, contactLabel, departmentName, organisationName, description } = this.state;
    axios.post(url, { contactName, phoneHome, phoneWork, phoneMobile, email, contactLabel, departmentName, organisationName, description })
    .then(() => {
      this.props.history.push("/contact");
      alert("Contact was successfully created!")
    });
  }

  render() {
    const loadingStyle = { fontSize: "36px" };
    const backStyle = { fontSize: "16px", textDecoration: "none" };
    const backDivStyle = { textAlign: "left", marginLeft: "20px" };
    return (
      <div>
        {this.state.isLoading &&
        <div style={loadingStyle}>
          Loading...
        </div>}
        {!this.state.isLoading &&
        <div>
        <div style={backDivStyle}><a href="/contact"><span style={backStyle}>Back</span></a></div>
        <h1>Create Contact</h1>
        <form onSubmit={this.onSubmit.bind(this)}>
            <label>Name </label>
            <input
              type="text"
              name="contactName"
              value={this.state.contactName}
              onChange={this.onChange.bind(this)}
              required
            /><br />

            <label>Home Phone Number </label>
            <input
              type="text"
              name="phoneHome"
              value={this.state.phoneHome}
              onChange={this.onChange.bind(this)}
            /><br />

            <label>Work Phone Number </label>
            <input
              type="text"
              name="phoneWork"
              value={this.state.phoneWork}
              onChange={this.onChange.bind(this)}
            /><br />

            <label>Mobile Phone Number </label>
            <input
              type="text"
              name="phoneMobile"
              value={this.state.phoneMobile}
              onChange={this.onChange.bind(this)}
              required
            /><br />

            <label>Email </label>
            <input
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.onChange.bind(this)}
              required
            /><br />

            <label>Label </label>
            <input
              type="text"
              name="contactLabel"
              value={this.state.contactLabel}
              onChange={this.onChange.bind(this)}
              required
            /><br />

            <label>Department Name </label>
            <input
              type="text"
              name="departmentName"
              value={this.state.departmentName}
              onChange={this.onChange.bind(this)}
              required
            /><br />

            <label>Organisation Name </label>
            <input
              type="text"
              name="organisationName"
              value={this.state.organisationName}
              onChange={this.onChange.bind(this)}
              required
            /><br />

            <label>Description </label>
            <textarea
              name="description"
              value={this.state.description}
              onChange={this.onChange.bind(this)}
            /><br />

            <button type="submit">Submit</button>
        </form>
        </div>}
      </div>
    )
  }
}