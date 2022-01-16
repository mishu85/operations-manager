// export default function Admin() {
//   return <div> So nice to be an admin</div>;
// }

import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { useEffect } from "react";
import {
  receiveData,
  changeRole,
  getUserOperations,
  deleteOperation,
} from "../api/operationsApi";
import { Link } from "react-router-dom";
// import { changeRole } from "../api/operationsApi";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [currentRole, setCurrentRole] = React.useState(props.row.role);
  const [userOps, setUserOps] = React.useState([]);

  const getUserOps = async (user_id, role) => {
    console.log("step1", user_id, role);
    const response = await getUserOperations(user_id, role);
    response.length === 0 ? setUserOps([]) : setUserOps(response);
    console.log(response);
    return;
  };

  const handleDeleteOp = async (op_id) => {
    await deleteOperation(op_id);
    const foundOperationIndex = userOps.findIndex(
      (op) => op.operation_id === op_id
    );
    const newUserOps = userOps.slice();
    newUserOps.splice(foundOperationIndex, 1);
    setUserOps(newUserOps);
    props.onOperationsCountChange(newUserOps.length, row.public_id);
  };

  const handleRole = async (public_id, role) => {
    await changeRole(public_id, role)
      .then(
        console.log("intial role:", currentRole),
        currentRole === "Admin"
          ? setCurrentRole("User")
          : setCurrentRole("Admin")
      )
      .then(console.log("role:", currentRole));
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              if (!open) {
                getUserOps(row.public_id, row.role);
              }
              setOpen(!open);
              open ? console.log("BACK") : console.log("ACTION");
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.operations}</TableCell>
        <TableCell align="right">{row.completed}</TableCell>
        <TableCell align="right">
          <button
            onClick={() => {
              handleRole(row.public_id, row.role);
              props.onRoleChange(
                row.role == "Admin" ? "User" : "Admin",
                row.public_id
              );
            }}
          >
            {row.role === "Admin" ? "Declass" : "Promote"}
          </button>
          {row.role}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {row.name}'s Entries
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  {userOps.length > 0 ? (
                    <TableRow>
                      <TableCell>Task</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell>No operations to display</TableCell>
                    </TableRow>
                  )}
                </TableHead>
                <TableBody>
                  {userOps.length > 0
                    ? userOps.map((ops) => (
                        <TableRow key={ops.operation_id}>
                          <TableCell component="th" scope="row">
                            {ops.text}
                          </TableCell>
                          <TableCell>
                            {ops.complete ? "Completed" : "Ongoing"}
                          </TableCell>
                          <TableCell align="right">
                            <button
                              onClick={() => {
                                handleDeleteOp(ops.operation_id);
                              }}
                            >
                              Delete Operation
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  const [data, setData] = React.useState(null);

  useEffect(async () => {
    const data = await receiveData();
    setData(data);
  }, []);

  const handleRoleChange = (role, userId) => {
    const foundUserIndex = data.findIndex((user) => user.public_id == userId);
    const newData = data.slice(); //why a new variable?
    newData[foundUserIndex].role = role;
    setData(newData);
  };

  const handleOperationsCountChange = (operationsCount, userId) => {
    const foundUserIndex = data.findIndex((user) => user.public_id == userId);
    const newData = data.slice(); //why a new variable?
    newData[foundUserIndex].operations = operationsCount;
    setData(newData);
  };

  return data ? (
    <div style={{ margin: "20px" }}>
      <button>
        {" "}
        <Link to="/home">Home</Link>
      </button>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>User</TableCell>
              <TableCell align="right">Operations</TableCell>
              <TableCell align="right">Completed</TableCell>
              <TableCell align="right">Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <Row
                key={row.name}
                row={row}
                onRoleChange={handleRoleChange}
                onOperationsCountChange={handleOperationsCountChange}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ) : null;
}
