import axios from "axios";
import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
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
  // const [departmentName, setDepartmentName] = useState("");
  // const [oldpassword, setOldPassword] = useState("");
  // const [newpassword, setNewPassword] = useState("");
  // const [retypepassword, setRetypePassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(true);
  const [values, setValues] = useState(initialValues);


  // Load data from the Backend when loading the page
  useEffect(() => {
    // Get contact based on the id
    const getContact = async () => {
      const BASE_URL = "https://developer-crm-backend.herokuapp.com";
      await axios.get(BASE_URL + "/profile", {withCredentials: true}).then(res => {
        const data = res.data;
        // console.log(data)
        setValues({
          username: data.username,
          email: data.email
        });
        
        setIsLoading(false);
      })
    }
    getContact();
  }, [])


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

  /* Handle saving the changes to text field and sending it to the Backend
   *
   * @param e Event
   */
  const onSubmit = (e) => {
    e.preventDefault();
    const BASE_URL = "https://developer-crm-backend.herokuapp.com";
    const url = BASE_URL + "/profile/updatepassword";
    axios.post(url, {...values},{withCredentials: true})
    .then((response) => {
      // console.log(response.status)
    Swal.fire({
      title: "Success!",
      text: "Password has been successfully updated!",
      icon: "success",
      showClass: {
        icon: ''
      }
    });
    props.history.push("/profile");
    setShowEdit(true);
    }).catch(error => {
      Swal.fire({
        title: "Update Fail!",
        text: "Password is not updated!",
        icon: "warning",
        showClass: {
          icon: ''
        }
      })
    })
  }

  const onCancel = () => {
    const id = props.match.params.id;
    window.location = '/profile';
  }

  // Styles
  // const deleteDivStyle = { textAlign: "right", marginRight: "2%" };
  // const cancelDivStyle = { textAlign: "left", marginLeft: "2%" };
  const buttonStyle = { textTransform: "none", width: "108px" };
  const marginStyle = { marginTop: "2%", marginLeft: "80px" };
  const profileStyle = { width: "500px", margin: "auto" };
  const textFieldStyle = { minWidth: "400px" };
  
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
          {/* setOldPassword={oldpassword} setNewPassword={newpassword} setRetypePassword={retypepassword} */}
          <Profile state={values} />
        </div>}
        {!showEdit &&
        <div style={profileStyle}>
          <h1>Update Password</h1>
          <form onSubmit={onSubmit}>
            <div>
              {/* <div style={labelStyle}>Name <span style={{color: "red"}}>*</span></div> */}
              <TextField
                label="Old Password"
                name="oldPassword"
                type="password"
                variant="outlined"
                size="small"
                style={textFieldStyle}
                value={values.oldpassword}
                onChange={onChange}
                required
              />
            </div><br />  
            <div>
              {/* <div style={labelStyle}>Email <span style={{color: "red"}}>*</span></div> */}
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                variant="outlined"
                size="small"
                style={textFieldStyle}
                value={values.newpassword}
                onChange={onChange}
                required
              />
            </div><br />
            <div>
              {/* <div style={labelStyle}>Email <span style={{color: "red"}}>*</span></div> */}
              <TextField
                label="Re-type Password"
                name="retypePassword"
                type="password"
                variant="outlined"
                size="small"
                style={textFieldStyle}
                value={values.retypepassword}
                onChange={onChange}
                required
              />
            </div><br />
            <Button type="submit" variant="contained" color="primary" style={buttonStyle}>update</Button>&nbsp;
            <Button variant="contained" color="secondary" style={buttonStyle} onClick={onCancel}>Cancel</Button>
          </form>
          <div><br /></div>
        </div>}
        {showEdit &&
        <div>
          <Button variant="contained" color="primary" onClick={toggleEdit} style={buttonStyle}>
            <EditIcon />&nbsp;Edit Password
          </Button>&nbsp;
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
  // const labelStyle = { textAlign: "left", marginLeft: "12%" };
  const textFieldStyle = { minWidth: "400px" };
  return (
    <div>
      <h1>Profile Page</h1>
      <div>
        <TextField
          label="Email "
          type="text"
          variant="outlined"
          size="small"
          style={textFieldStyle}
          value={props.state.email}
          inputProps={
            { readOnly: true }
          }
        />
      </div><br />
      <div>
        <TextField
          label="Name"
          type="text"
          variant="outlined"
          size="small"
          style={textFieldStyle}
          value={props.state.username}
          inputProps={
            { readOnly: true }
          }
        />
      </div><br />
    </div>
  )
}