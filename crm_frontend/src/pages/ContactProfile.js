import axios from "axios";
import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import Swal from 'sweetalert2'
import CircularProgress from '@mui/material/CircularProgress';

/* Display a contact profile page and can be switched to an edit contact profile page
 *
 * @param props Data passed on from a parent component
 */
export default function ContactProfile(props) {
  // Initial values
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
  const [departmentNameList, setDepartmentNameList] = useState([]);
  const [organisationNameList, setOrganisationNameList] = useState([]);

  // Load data from the Backend when loading the page
  useEffect(() => {
    // Get contact based on the id
    const getContact = async () => {
      const BASE_URL = "https://developer-crm-backend.herokuapp.com";
      const id = props.match.params.id;
      await axios.get(BASE_URL + "/contact/" + id, {withCredentials: true}).then(res => {
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
    getDepartmentNames();
    getOrganisationNames();
  }, [props.match.params.id])

  /* Get the department name of the contact
   *
   * @param departmentId The department ID of the contact
   */
  const getDepartmentName = async (departmentId) => {
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    await axios.get(BASE_URL + "/department", {withCredentials: true}).then(res => {
      const dep = res.data.find(x => x._id === departmentId);
      const departmentName = dep.departmentName;
      setDepartmentName(departmentName);
    })
  }

  /* Get the organisation name the contact is in
   *
   * @param organisationId The organisation ID of the contact
   */
  const getOrganisationName = async (organisationId) => {
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    await axios.get(BASE_URL + "/organisation", {withCredentials: true}).then(res => {
      const org = res.data.find(x => x._id === organisationId);
      const organisationName = org.orgName;
      setOrganisationName(organisationName);
    })
  }

  /* Get list of department names from the Backend
   */
  const getDepartmentNames = async () => {
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    await axios.get(BASE_URL + "/department", {withCredentials: true}).then(res => {
      const departmentNames = res.data.map(x => x.departmentName)
      setDepartmentNameList(departmentNames);
    })
  }

  /* Get list of organisation names from the Backend
   */
  const getOrganisationNames = async () => {
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    await axios.get(BASE_URL + "/organisation", {withCredentials:true}).then(res => {
      const organisationNames = res.data.map(x => x.orgName)
      setOrganisationNameList(organisationNames);
    })
  }

  /* Delete the contact
  */
  const deleteContact = () => {
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    const id = props.match.params.id;
    Swal.fire({
      title: "Warning!",
      text: "Are you sure you want to delete this contact?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showClass: {
        icon: ''
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(BASE_URL + "/contact/" + id, {withCredentials: true}).then(() => {
          Swal.fire({
            title: "Success!",
            text: "Contact has been successfully deleted!",
            icon: "success",
            showClass: {
              icon: ''
            }
          });
          props.history.push("/contact");
        })
      }
    })
  }

  /* Change the contact profile page to edit contact profile page when the 'Edit Contact' button is clicked
   */
  const toggleEdit = () => {
    setShowEdit(!showEdit);
  }

  /* Handle any changes to the input text fields
   *
   * @param e Event
   */
  const onChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  /* Handle any changes to the department name text field
   *
   * @param e Event
   */
  const onDepartmentNameChange = (e) => {
    setDepartmentName(e.target.value);
  }

  /* Handle any changes to the organisation name text field
   *
   * @param e Event
   */
  const onOrganisationNameChange = (e) => {
    setOrganisationName(e.target.value);
  }

  /* Handle changing value when choosing department suggestion from autocomplete
   *
   * @param e Event
   * @param value The department name from the chosen suggestion
   */
  const onChooseDepartmentSuggestion = (e, value) => {
    setDepartmentName(value)
  }

  /* Handle changing value when choosing organisation suggestion from autocomplete
   *
   * @param e Event
   * @param value The organisation name from the chosen suggestion
   */
  const onChooseOrganisationSuggestion = (e, value) => {
    setOrganisationName(value)
  }

  /* Handle saving the changes to text field and sending it to the Backend
   *
   * @param e Event
   */
  const onSubmit = (e) => {
    e.preventDefault();
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    const url = BASE_URL + "/contact/edit";
    const _id = props.match.params.id;
    axios.post(url, { _id, ...values, departmentName, organisationName }, {withCredentials: true})
    .then(() => {
      Swal.fire({
        title: "Success!",
        text: "Contact has been successfully updated!",
        icon: "success",
        showClass: {
          icon: ''
        }
      });
      props.history.push("/contact/profile/" + _id);
      setShowEdit(true);
    });
  }

  const onCancel = () => {
    const id = props.match.params.id;
    window.location = '/contact/profile/' + id;
  }

  // Styles
  const loadingStyle = { fontSize: "36px" };
  // const deleteDivStyle = { textAlign: "right", marginRight: "2%" };
  // const cancelDivStyle = { textAlign: "left", marginLeft: "2%" };
  const buttonStyle = { textTransform: "none", width: "108px" };
  const marginStyle = { marginTop: "2%", marginLeft: "80px" };
  const profileStyle = { width: "500px", margin: "auto" };
  const labelStyle = { textAlign: "left", marginLeft: "12%" };
  const textFieldStyle = { minWidth: "400px" };
  const autoCompleteStyle = { width: "400px", marginLeft: "10%" }
  return (
    <div style={marginStyle}>
      {isLoading &&
      <div>
          <CircularProgress />
      </div>}
      {!isLoading &&
      <div>
        {showEdit &&
        <div style={profileStyle}>
          <Profile state={values} departmentName={departmentName} organisationName={organisationName} />
        </div>}
        {!showEdit &&
        <div style={profileStyle}>
          <h1>Edit Contact</h1>
          <form onSubmit={onSubmit}>
            <div>
              <TextField
                label="Name"
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
              <TextField
                label="Mobile Number"
                name="phoneMobile"
                type="text"
                variant="outlined"
                size="small"
                style={textFieldStyle}
                value={values.phoneMobile}
                onChange={onChange}
                required
              />
            </div><br />
            <div>
              <TextField
                label="Home Number"
                name="phoneHome"
                type="text"
                variant="outlined"
                size="small"
                style={textFieldStyle}
                value={values.phoneHome}
                onChange={onChange}
              />
            </div><br />
            <div>
              <TextField
                label="Work Number"
                name="phoneWork"
                type="text"
                variant="outlined"
                size="small"
                style={textFieldStyle}
                value={values.phoneWork}
                onChange={onChange}
              />
            </div><br />
            <div>
              <TextField
                label="Email"
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
              <TextField
                label="Label"
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
              <Autocomplete 
                freeSolo
                options={departmentNameList}
                value={departmentName}
                style={autoCompleteStyle}
                onChange={onChooseDepartmentSuggestion}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      style: { paddingLeft: "7px", paddingTop: "3px", paddingBottom: "3px" }
                    }}
                    label="Department"
                    name="departmentName"
                    type="text"
                    variant="outlined"
                    onChange={onDepartmentNameChange}
                    required
                  />
                )}
              />
            </div><br />
            <div>
              <Autocomplete 
                freeSolo
                options={organisationNameList}
                value={organisationName}
                style={autoCompleteStyle}
                onChange={onChooseOrganisationSuggestion}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      style: { paddingLeft: "7px", paddingTop: "3px", paddingBottom: "3px" }
                    }}
                    label="Organisation"
                    name="organisationName"
                    type="text"
                    variant="outlined"
                    onChange={onOrganisationNameChange}
                    required
                  />
                )}
              />
            </div><br />
            <div>
              <TextField
                label="Description"
                name="description"
                type="text"
                variant="outlined"
                multiline
                maxRows={5}
                style={textFieldStyle}
                value={values.description}
                onChange={onChange}
              />
            </div><br />
            <Button type="submit" variant="contained" color="primary" style={buttonStyle}>Save</Button>&nbsp;
            <Button variant="contained" color="secondary" style={buttonStyle} onClick={onCancel}>Cancel</Button>
          </form>
          <div><br /></div>
        </div>}
        {showEdit &&
        <div>
          <Button variant="contained" color="primary" onClick={toggleEdit} style={buttonStyle}>
            <EditIcon />&nbsp;Edit
          </Button>&nbsp;
          <Button variant="contained" color="secondary" style={buttonStyle} onClick={deleteContact}>
            <DeleteIcon />&nbsp;Delete&nbsp;
          </Button>
          <div><br /></div>
        </div>}
      </div>}
    </div>
  )
}

/* Display a contact profile page
 *
 * @param props Data passed on from a parent component
 */
function Profile(props) {
  const textFieldStyle = { minWidth: "400px" };
  return (
    <div>
      <h1>{props.state.contactName}</h1>
      <div>
        <TextField
          label="Mobile Number"
          type="text"
          variant="outlined"
          size="small"
          style={textFieldStyle}
          value={props.state.phoneMobile}
          placeholder="-"
          inputProps={
            { readOnly: true }
          }
        />
      </div><br />
      <div>
        <TextField
          label="Home Number"
          type="text"
          variant="outlined"
          size="small"
          style={textFieldStyle}
          value={props.state.phoneHome}
          placeholder="-"
          inputProps={
            { readOnly: true }
          }
        />
      </div><br />
      <div>
        <TextField
          label="Work Number"
          type="text"
          variant="outlined"
          size="small"
          style={textFieldStyle}
          value={props.state.phoneWork}
          placeholder="-"
          inputProps={
            { readOnly: true }
          }
        />
      </div><br />
      <div>
        <TextField
          label="Email"
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
        <TextField
          label="Label"
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
        <TextField
          label="Department"
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
        <TextField
          label="Organisation"
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
        <TextField
          label="Description"
          type="text"
          variant="outlined"
          multiline
          maxRows={5}
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