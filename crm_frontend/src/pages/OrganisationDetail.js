import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

export default function OrganisationDetail(props) {
  const [organisation, setOrganisation] = useState([]);
  const [contact, setContact] = useState([]);
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    /*get the organisation list from the database*/
    const BASE_URL =
      "http://localhost:5000/organisation/" + props.match.params.id;
    fetch(BASE_URL)
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setOrganisation(data);
      });
    /*get the contact list from the database*/
    fetch("http://localhost:5000/contact")
      .then((data) => data.json())
      .then((data) =>
        data.filter((c) => c.organisationId === props.match.params.id)
      )
      .then((data) => {
        console.log(data);
        setContact(data);
      });
    /*get the department list from database */
    fetch("http://localhost:5000/department")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setDepartment(data);
      });
  }, []);

  return (
    <div>
      {organisation.map((org) => {
        return (
          <div>
            <h1>{org.orgName}</h1>
          </div>
        );
      })}
      <h1>Contact List</h1>
      <TableContainer
        component={Paper}
        style={{ width: "60%", marginLeft: "20%", marginTop: "2%" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Contact Number
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contact.map((cont) => {
              if (department.length > 0) {
                const dept = department.find(
                  (d) => cont.departmentId === d._id
                );
                return (
                  <TableRow
                    key={cont.contactName}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell key={`${cont.contactName}-table-cell`}>
                      {cont.contactName}
                    </TableCell>
                    <TableCell key={cont.email}>{cont.email}</TableCell>
                    <TableCell key={cont.phoneNumbers.mobile}>
                      {cont.phoneNumbers.mobile}
                    </TableCell>
                    <TableCell key={dept.departmentName}>
                      {dept.departmentName}
                    </TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
