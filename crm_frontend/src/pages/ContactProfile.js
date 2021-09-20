import axios from "axios";
import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import swal from 'sweetalert';

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
      swal({
        title: "Success!",
        text: "Contact has been successfully updated!",
        icon: "success",
      });
      props.history.push("/contact/profile/" + _id);
      setShowEdit(true);
    });
  }

  // styles
  const loadingStyle = { fontSize: "36px" };
  const backDivStyle = { textAlign: "left", marginLeft: "2%" };
  const buttonStyle = { textTransform: "none" };
  const marginStyle = { marginTop: "100px", marginLeft: "80px" };
  const linkStyle = { textDecoration: "none" };
  const profileStyle = { width: "500px", margin: "auto" };
  const labelStyle = { textAlign: "left", marginLeft: "12%" };
  const textFieldStyle = { minWidth: "400px", marginTop: "2%" };

  return (
    <div style={marginStyle}>
      {isLoading &&
      <div style={loadingStyle}>
          Loading...
      </div>}
      {!isLoading &&
      <div>
        <div style={backDivStyle}>
          <a href="/contact" style={linkStyle}>
            <Button variant="contained" color="action" style={buttonStyle}>Back</Button>
          </a>
        </div>
        {showEdit &&
        <div style={profileStyle}>
          <Profile state={values} departmentName={departmentName} organisationName={organisationName} />
        </div>}
        {!showEdit &&
        <div style={profileStyle}>
          <h1>Edit Contact</h1><br />
          <form onSubmit={onSubmit}>
            <div>
              <div style={labelStyle}>Name <span style={{color: "red"}}>*</span></div>
              <TextField
                name="contactName"
                type="text"
                variant="outlined"
                size="small"
                style={textFieldStyle}
                value={values.contactName}
                onChange={onChange}
                required
              />
            </div><br />

            <div>
              <div style={labelStyle}>Phone Numbers</div>
              <div style={{marginTop: "3%"}}>
                <TextField
                  label="Home"
                  name="phoneHome"
                  type="text"
                  variant="outlined"
                  size="small"
                  style={{minWidth: "400px"}}
                  value={values.phoneHome}
                  onChange={onChange}
                />
              </div><br />
              <div>
                <TextField
                  label="Work"
                  name="phoneWork"
                  type="text"
                  variant="outlined"
                  size="small"
                  style={{minWidth: "400px"}}
                  value={values.phoneWork}
                  onChange={onChange}
                />
              </div><br />
              <div>
                <TextField
                  label="Mobile"
                  name="phoneMobile"
                  type="text"
                  variant="outlined"
                  size="small"
                  style={{minWidth: "400px"}}
                  value={values.phoneMobile}
                  onChange={onChange}
                  required
                />
              </div>
            </div><br />

            <div>
              <div style={labelStyle}>Email <span style={{color: "red"}}>*</span></div>
              <TextField
                name="email"
                type="email"
                variant="outlined"
                size="small"
                style={textFieldStyle}
                value={values.email}
                onChange={onChange}
                required
              />
            </div><br />

            <div>
              <div style={labelStyle}>Label <span style={{color: "red"}}>*</span></div>
              <TextField
                name="contactLabel"
                type="text"
                variant="outlined"
                size="small"
                style={textFieldStyle}
                value={values.contactLabel}
                onChange={onChange}
                required
              />
            </div><br />

            <div>
              <div style={labelStyle}>Department Name <span style={{color: "red"}}>*</span></div>
              <TextField
                name="departmentName"
                type="text"
                variant="outlined"
                size="small"
                style={textFieldStyle}
                value={departmentName}
                onChange={onDepartmentNameChange}
                required
              />
            </div><br />

            <div>
              <div style={labelStyle}>Organisation Name <span style={{color: "red"}}>*</span></div>
              <TextField
                name="organisationName"
                type="text"
                variant="outlined"
                size="small"
                style={textFieldStyle}
                value={organisationName}
                onChange={onOrganisationNameChange}
                required
              />
            </div><br />

            <div>
              <div style={labelStyle}>Description</div>
              <TextField
                name="description"
                type="text"
                variant="outlined"
                multiline
                rows={3}
                rowsMax={5}
                style={textFieldStyle}
                value={values.description}
                onChange={onChange}
              />
            </div><br />

            <Button type="submit" variant="contained" color="action" style={buttonStyle}>Save Changes</Button>
          </form>
          <div><br /></div>
        </div>}
        {showEdit &&
        <div>
          <Button variant="contained" color="primary" onClick={toggleEdit} style={buttonStyle}>
            <EditIcon />&nbsp;Edit Contact
          </Button>
          <div><br /></div>
        </div>}
      </div>}
    </div>
  )
}

// Display the contact's profile info
function Profile(props) {
  const labelStyle = { textAlign: "left", marginLeft: "12%" };
  const textFieldStyle = { minWidth: "400px", marginTop: "2%" };
  return (
    <div>
      <h1>{props.state.contactName}</h1><br />
      <div>
        <div style={labelStyle}>Phone Numbers</div>
        <div style={{marginTop: "3%"}}>
          <TextField
            label="Home"
            type="text"
            variant="outlined"
            size="small"
            style={{minWidth: "400px"}}
            value={props.state.phoneHome}
            placeholder="-"
            inputProps={
              { readOnly: true }
            }
          />
        </div><br />
        <div>
          <TextField
            label="Work"
            type="text"
            variant="outlined"
            size="small"
            style={{minWidth: "400px"}}
            value={props.state.phoneWork}
            placeholder="-"
            inputProps={
              { readOnly: true }
            }
          />
        </div><br />
        <div>
          <TextField
            label="Mobile"
            type="text"
            variant="outlined"
            size="small"
            style={{minWidth: "400px"}}
            value={props.state.phoneMobile}
            placeholder="-"
            inputProps={
              { readOnly: true }
            }
          />
        </div>
      </div><br />
      <div>
        <div style={labelStyle}>Email</div>
        <TextField
          type="text"
          variant="outlined"
          size="small"
          style={textFieldStyle}
          value={props.state.email}
          placeholder="-"
          inputProps={
            { readOnly: true }
          }
        />
      </div><br />
      <div>
        <div style={labelStyle}>Department</div>
        <TextField
          type="text"
          variant="outlined"
          size="small"
          style={textFieldStyle}
          value={props.departmentName}
          placeholder="-"
          inputProps={
            { readOnly: true }
          }
        />
      </div><br />
      <div>
        <div style={labelStyle}>Organisation</div>
        <TextField
          type="text"
          variant="outlined"
          size="small"
          style={textFieldStyle}
          value={props.organisationName}
          placeholder="-"
          inputProps={
            { readOnly: true }
          }
        />
      </div><br />
      <div>
        <div style={labelStyle}>Label</div>
        <TextField
          type="text"
          variant="outlined"
          size="small"
          style={textFieldStyle}
          value={props.state.contactLabel}
          placeholder="-"
          inputProps={
            { readOnly: true }
          }
        />
      </div><br />
      <div>
        <div style={labelStyle}>Description</div>
        <TextField
          type="text"
          variant="outlined"
          multiline
          rows={3}
          rowsMax={5}
          style={textFieldStyle}
          value={props.state.description}
          placeholder="-"
          inputProps={
            { readOnly: true }
          }
        />
      </div><br />
    </div>
  )
}