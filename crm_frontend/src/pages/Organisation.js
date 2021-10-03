import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

export default function Organisation() {
  const [organisations, setOrganisations] = useState([]);
  const [contact, setContact] = useState([]);

  useEffect(() => {
    /*get the organisation list from the database*/
    fetch("http://localhost:5000/organisation")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setOrganisations(data);
      });
    /*get the contact list from the database*/
    fetch("http://localhost:5000/contact")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setContact(data);
      });
  }, []);

  return (
    <div>
      <h1 style={{ marginRight: "10%" }}>Organisation List</h1>
      <TableContainer
        component={Paper}
        style={{ width: "60%", marginLeft: "20%", marginTop: "2%" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>
                Organisation Name
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Network Size</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organisations.map((org) => {
              const size = contact.filter(
                (c) => c.organisationId === org._id
              ).length;
              return (
                <TableRow
                  key={org.orgName}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{org.orgName}</TableCell>
                  <TableCell>{size}</TableCell>
                  <TableCell align="center">
                    <a
                      href={"/organisation/" + org._id}
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        variant="contained"
                        style={{ textTransform: "none" }}
                      >
                        View Detail
                      </Button>
                    </a>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
    </div>
  );
}
