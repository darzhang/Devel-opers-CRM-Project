import axios from "axios";
import React, { useState, useEffect } from "react";

export default function ContactProfile(props) {
  // initial values
  const initialValues = {
    contactName: "",
    phoneHome: "",
    phoneWork: "",
    phoneMobile: "",
    email: "",
    contactLabel: "",
    description: ""
  }

  // useState hooks
  const [departmentName, setDepartmentName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(true);
  const [values, setValues] = useState(initialValues);

  // load the data when loading the page
  useEffect(() => {
    // get contact based on the id
    const getContact = async () => {
      const BASE_URL = "http://localhost:5000";
      const id = props.match.params.id;
      await axios.get(BASE_URL + "/contact/" + id).then(res => {
        const data = res.data;
        setValues({
          contactName: data.contactName,
          phoneHome: data.phoneNumbers.home,
          phoneWork: data.phoneNumbers.work,
          phoneMobile: data.phoneNumbers.mobile,
          email: data.email,
          contactLabel: data.label,
          description: data.description
        });
        getDepartmentName(data.departmentId);
        getOrganisationName(data.organisationId);
        setIsLoading(false);
      })
    }
    getContact();
  }, [props.match.params.id])

  // get the department name the contact is in
  const getDepartmentName = async (departmentId) => {
    const BASE_URL = "http://localhost:5000";
    await axios.get(BASE_URL + "/department").then(res => {
      const dep = res.data.find(x => x._id === departmentId);
      const departmentName = dep.departmentName;
      setDepartmentName(departmentName);
    })
  }

  // get the organisation name the contact is in
  const getOrganisationName = async (organisationId) => {
    const BASE_URL = "http://localhost:5000";
    await axios.get(BASE_URL + "/organisation").then(res => {
      const org = res.data.find(x => x._id === organisationId);
      const organisationName = org.orgName;
      setOrganisationName(organisationName);
    })
  }

  // when the edit button is clicked, the profile will become editable
  const toggleEdit = () => {
    setShowEdit(!showEdit);
  }

  // handle the change for the states
  const onChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  // handle the change for the states
  const onDepartmentNameChange = (e) => {
    setDepartmentName(e.target.value);
  }

  // handle the change for the states
  const onOrganisationNameChange = (e) => {
    setOrganisationName(e.target.value);
  }

  // handle saving the changes to the data to the backend
  const onSubmit = (e) => {
    e.preventDefault();
    const BASE_URL = "http://localhost:5000";
    const url = BASE_URL + "/contact/edit";
    const _id = props.match.params.id;
    axios.post(url, { _id, ...values, departmentName, organisationName })
    .then(() => {
      props.history.push("/contact/profile/" + _id);
      setShowEdit(true);
      alert("Contact was successfully updated!")
    });
  }

  // styles
  const loadingStyle = { fontSize: "36px" };
  const backStyle = { fontSize: "16px", textDecoration: "none" };
  const backDivStyle = { textAlign: "left", marginLeft: "20px" };
  const buttonStyle = { padding: "10px", fontSize: "16px", borderRadius: "4px", width: "120px" };
  const marginStyle = { marginTop: "100px", marginLeft: "80px" };

  return (
    <div style={marginStyle}>
      {isLoading &&
      <div style={loadingStyle}>
          Loading...
      </div>}
      {!isLoading &&
      <div>
        <div style={backDivStyle}><a href="/contact"><span style={backStyle}>Back</span></a></div>
        {showEdit &&
        <Profile state={values} departmentName={departmentName} organisationName={organisationName} />}
        {!showEdit &&
        <div>
          <form onSubmit={onSubmit}>
            <label>Name </label>
            <input
              type="text"
              name="contactName"
              value={values.contactName}
              onChange={onChange}
              required
            /><br />

            <label>Home Phone Number </label>
            <input
              type="text"
              name="phoneHome"
              value={values.phoneHome}
              onChange={onChange}
            /><br />

            <label>Work Phone Number </label>
            <input
              type="text"
              name="phoneWork"
              value={values.phoneWork}
              onChange={onChange}
            /><br />

            <label>Mobile Phone Number </label>
            <input
              type="text"
              name="phoneMobile"
              value={values.phoneMobile}
              onChange={onChange}
              required
            /><br />

            <label>Email </label>
            <input
              type="text"
              name="email"
              value={values.email}
              onChange={onChange}
              required
            /><br />

            <label>Label </label>
            <input
              type="text"
              name="contactLabel"
              value={values.contactLabel}
              onChange={onChange}
              required
            /><br />

            <label>Department Name </label>
            <input
              type="text"
              name="departmentName"
              value={departmentName}
              onChange={onDepartmentNameChange}
              required
            /><br />

            <label>Organisation Name </label>
            <input
              type="text"
              name="organisationName"
              value={organisationName}
              onChange={onOrganisationNameChange}
              required
            /><br />

            <label>Description </label>
            <textarea
              name="description"
              value={values.description}
              onChange={onChange}
            /><br />

            <button type="submit">Save Changes</button>
          </form>
        </div>}
        {showEdit &&
        <div>
          <button onClick={toggleEdit} style={buttonStyle}>
            {showEdit ? "Edit Contact" : "Save Changes"}
          </button>
        </div>}
      </div>}
    </div>
  )
}

// Display the contact's profile info
function Profile(props) {
  return (
    <div>
      <h1>{props.state.contactName}</h1><br />
      <div>
        <div>Phone Numbers:</div>
        <div>Home</div>
        <div>{props.state.phoneHome}</div>
        <div>Work</div>
        <div>{props.state.phoneWork}</div>
        <div>Mobile</div>
        <div>{props.state.phoneMobile}</div>
      </div><br />
      <div>
        <div>Email:</div>
        <div>{props.state.email}</div>
      </div><br />
      <div>
        <div>Department:</div>
        <div>{props.departmentName}</div>
      </div><br />
      <div>
        <div>Organisation:</div>
        <div>{props.organisationName}</div>
      </div><br />
      <div>
        <div>Label:</div>
        <div>{props.state.contactLabel}</div>
      </div><br />
      <div>
        <div>Description:</div>
        <div>{props.state.description}</div>
      </div><br />
    </div>
  )
}