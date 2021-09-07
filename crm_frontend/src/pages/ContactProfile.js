import axios from "axios";
import React, { Component } from "react";

export default class ContactProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: {},
      department: {},
      organisation: {},
      isLoading: true,
      showEdit: true,
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

  // load the data when loading the page
  componentDidMount = () => {
    this.getContact();
  }

  // get contact based on the id
  async getContact() {
    const BASE_URL = "http://localhost:5000";
    const id = this.props.match.params.id;
    await axios.get(BASE_URL + "/contact/" + id).then(res => {
      this.setState({
        contact: res.data,
        contactName: res.data.contactName,
        phoneHome: res.data.phoneNumbers.home,
        phoneWork: res.data.phoneNumbers.work,
        phoneMobile: res.data.phoneNumbers.mobile,
        email: res.data.email,
        contactLabel: res.data.label,
        description: res.data.description
      });
    })
    this.getDepartmentName();
    this.getOrganisationName();
    this.state.isLoading = false
  }

  // get the department name the contact is in
  async getDepartmentName() {
    const BASE_URL = "http://localhost:5000";
    await axios.get(BASE_URL + "/department").then(res => {
      const data = res.data;
      const dep = data.find(x => x._id === this.state.contact.departmentId);
      this.setState({
        department: dep,
        departmentName: dep.departmentName
      });
    })
  }

  // get the organisation name the contact is in
  async getOrganisationName() {
    const BASE_URL = "http://localhost:5000";
    await axios.get(BASE_URL + "/organisation").then(res => {
      const data = res.data;
      const org = data.find(x => x._id === this.state.contact.organisationId);
      this.setState({
        organisation: org,
        organisationName: org.orgName
      });
    })
  }

  // when the edit button is clicked, the profile will become editable
  toggleEdit() {
    this.setState({
      showEdit: !this.state.showEdit
    });
  }

  // handle the change for the states
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // handle saving the changes to the data to the backend
  onSubmit(e) {
    e.preventDefault();
    const BASE_URL = "http://localhost:5000";
    const url = BASE_URL + "/contact/edit";
    const _id = this.props.match.params.id;
    const { contactName, phoneHome, phoneWork, phoneMobile, email, contactLabel, departmentName, organisationName, description } = this.state;
    axios.post(url, { _id, contactName, phoneHome, phoneWork, phoneMobile, email, contactLabel, departmentName, organisationName, description })
    .then(() => {
      this.props.history.push("/contact/profile/" + _id);
      this.setState({
        showEdit: true
      });
      alert("Contact was successfully updated!")
    });
  }

  render() {
    const loadingStyle = { fontSize: "36px" };
    const backStyle = { fontSize: "16px", textDecoration: "none" };
    const backDivStyle = { textAlign: "left", marginLeft: "20px" };
    const buttonStyle = { padding: "10px", fontSize: "16px", borderRadius: "4px", width: "120px" }
    return (
      <div>
        {this.state.isLoading &&
        <div style={loadingStyle}>
            Loading...
        </div>}
        {!this.state.isLoading &&
        <div>
          <div style={backDivStyle}><a href="/contact"><span style={backStyle}>Back</span></a></div>
          {this.state.showEdit &&
          <Profile state={this.state} />}
          {!this.state.showEdit &&
          <div>
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

              <button type="submit">Save Changes</button>
            </form>
          </div>}
          {this.state.showEdit &&
          <div>
            <button onClick={this.toggleEdit.bind(this)} style={buttonStyle}>
              {this.state.showEdit ? "Edit Contact" : "Save Changes"}
            </button>
          </div>}
        </div>}
      </div>
    )
  }
}

// Display the contact's profile info
function Profile(props) {
  return (
    <div>
      <h1>{props.state.contact.contactName}</h1><br />
      <div>
        <div>Phone Numbers:</div>
        <div>Home</div>
        <div>{props.state.contact.phoneNumbers.home}</div>
        <div>Work</div>
        <div>{props.state.contact.phoneNumbers.work}</div>
        <div>Mobile</div>
        <div>{props.state.contact.phoneNumbers.mobile}</div>
      </div><br />
      <div>
        <div>Email:</div>
        <div>{props.state.contact.email}</div>
      </div><br />
      <div>
        <div>Organisation:</div>
        <div>{props.state.organisation.orgName}</div>
      </div><br />
      <div>
        <div>Department:</div>
        <div>{props.state.department.departmentName}</div>
      </div><br />
      <div>
        <div>Label:</div>
        <div>{props.state.contact.label}</div>
      </div><br />
      <div>
        <div>Description:</div>
        <div>{props.state.contact.description}</div>
      </div><br />
    </div>
  )
}