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
import { receiveData } from "../api/operationsApi";
import { Link } from "react-router-dom";
import { changeRole } from "../api/operationsApi";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [currentRole, setCurrentRole] = React.useState(props.row.role);

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

  // useEffect(() => {}, [currentRole]);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
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
                Entries
              </Typography>
              {/* <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
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
    const newData = data;
    newData[foundUserIndex].role = role;
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
              <Row key={row.name} row={row} onRoleChange={handleRoleChange} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ) : null;
}
