import React from "react";
import { Link } from "react-router-dom";
import Auth from "../auth";
import { TheHttpClient } from "../TheHttpClient";
import { useState, useEffect } from "react";
import { getAllOperations, postOperation, Vari } from "../api/operationsApi";
import MediaCard from "./apiComponents/operationsComp";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [userPublicId, setUserPublicId] = useState("");
  const [userAdmin, setUserAdmin] = useState(false);
  const [showOp, setShowOp] = useState(true);
  const [operations, setOperations] = useState([]);
  const [newOperation, setNewOperation] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Auth.getInstance().isAuthenticated()
  );
  const [dirty, setDirty] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // if (Auth.getInstance().isAuthenticated()) {
  //   const userMe = Auth.getInstance().getMyUser().me;
  //   //new if statement for avoid infinite rendering loop
  //   if (userName === "") {
  //     setUserName(userMe.name);
  //     setUserPublicId(userMe.public_id);
  //     setUserAdmin(userMe.admin);
  //   }
  //   console.log(Auth.getInstance().getMyUser().me);
  //   console.log(userName, userPublicId, userAdmin);
  // }

  useEffect(() => {
    if (Auth.getInstance().isAuthenticated()) {
      const userMe = Auth.getInstance().getMyUser().me;
      setUserName(userMe.name);
      setUserPublicId(userMe.public_id);
      setUserAdmin(userMe.admin);
      getOperations();
    }
  }, []);

  const getOperations = async () => {
    const resp = await getAllOperations();
    setOperations(resp);
    // console.log("rrrrr:", resp);
    // console.log("operations_async", operations);
    // console.log("who?", Auth.getInstance().getMyUser().me.admin);

    // operations === resp ? console.log("DADADA!") : console.log("NUNUNUNU");
  };

  const handleShowOp = () => {
    if (showOp === false) {
      // const response = await TheHttpClient().get("/operations");
      // console.log(response.data);

      setShowOp(true);
      return;
    }
    setShowOp(false);
  };

  const handleAdd = () => {
    setNewOperation(true);
  };

  const handleClickAway = () => {
    console.log("handleClickAway");
    if (dialogOpen) {
      return;
    }

    if (!dirty) {
      setNewOperation(false);
      setDirty(false);
      return;
    }

    setDialogOpen(true);
  };

  const handleDialogConfirm = (value) => {
    if (!value) {
      setNewOperation(false);
      setDirty(false);
    }
    setDialogOpen(false);
  };

  const handleDirtyChange = (value) => {
    setDirty(value);
  };

  return (
    <div style={{ margin: 11 }}>
      <h1>Finally Home{isAuthenticated ? ", " + userName : null}!</h1>
      {isAuthenticated ? (
        <div id="test">
          <div>
            {/* <button onClick={handleTest}>Test if working</button> */}
            <button onClick={handleShowOp}>
              {" "}
              {showOp ? "Hide operations" : "Show operations"}
            </button>
            <button
              onClick={() => {
                Auth.getInstance().logout();
                setIsAuthenticated(false);
              }}
            >
              Logout
            </button>
            {Auth.getInstance().isAuthenticated() ? (
              <button onClick={newOperation ? null : handleAdd}>
                Add operation
              </button>
            ) : null}
          </div>
          {userAdmin === true ? (
            <div>
              <br />
              <Link to="/admin">Do the admin job</Link>
            </div>
          ) : null}
          {newOperation ? (
            <ClickAwayListener onClickAway={handleClickAway}>
              <div style={{ display: "contents" }}>
                <MediaCard
                  id={null}
                  name={"New operation"}
                  text={null}
                  editable={true}
                  initialValue={false}
                  onSubmit={async (newOpObject) => {
                    if (dirty) {
                      console.log("onSubmit:", newOpObject.text);
                      await postOperation(newOpObject.text).then(
                        setNewOperation(false)
                      );
                      await getOperations();
                    }
                  }}
                  onDirtyChange={handleDirtyChange}
                />
              </div>
            </ClickAwayListener>
          ) : null}
          {showOp && operations.length > 0 ? (
            <div>
              <ul>
                {operations.map((op) => (
                  <MediaCard
                    key={op.id}
                    id={op.id}
                    name={op.name}
                    text={op.text}
                    editable={false}
                    initialValue={op.complete}
                    user_id={op.user_id}
                  />
                ))}
              </ul>
            </div>
          ) : null}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>{"Warning"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Data will be lost when you leave. Wanna stay?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={(event) => {
                  // event.preventDefault();
                  event.stopPropagation();
                  //https://stackoverflow.com/questions/34929267/material-ui-how-to-stop-propagation-of-click-event-in-nested-components
                  handleDialogConfirm(false);
                  console.log("Leave Button:", event);
                }}
              >
                Leave
              </Button>
              <Button
                onClick={(event) => {
                  // event.preventDefault();
                  event.stopPropagation();
                  handleDialogConfirm(true);
                  console.log("Stay Button:", event);
                }}
                autoFocus
              >
                Stay
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}
