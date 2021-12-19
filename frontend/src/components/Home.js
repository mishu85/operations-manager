import React from "react";
import { Link } from "react-router-dom";
import Auth from "../auth";
import { TheHttpClient } from "../TheHttpClient";
import { useState, useEffect } from "react";
import { getAllOperations, Vari } from "../api/operationsApi";
import MediaCard from "./apiComponents/operationsComp";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [userPublicId, setUserPublicId] = useState("");
  const [userAdmin, setUserAdmin] = useState(false);
  const [showOp, setShowOp] = useState(false);
  const [operations, setOperations] = useState([]);

  const [isAuthenticated, setIsAuthenticated] = useState(
    Auth.getInstance().isAuthenticated()
  );

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
    console.log("rrrrr:", resp);
    console.log("operations_async", operations);

    // operations === resp ? console.log("DADADA!") : console.log("NUNUNUNU");
  };

  const injectOperations = (op) => {
    if (op.length > 0) {
      return (
        <div>
          <ul>
            {op.map((o) => (
              <li>
                <MediaCard name={o.name} text={o.text} />
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return null;
    }
  };

  const testFu = () => {
    return <div>Sa injectam slanina in gaina!</div>;
  };

  const handleTest = async () => {
    const response = await TheHttpClient().get(
      "/user/299b534c-96a8-4cc7-a8ab-1e0bfbdd541f"
    );
    console.log(response.data);
  };

  const handleShowOp = async () => {
    if (showOp === false) {
      // const response = await TheHttpClient().get("/operations");
      // console.log(response.data);

      setShowOp(true);
      return;
    }
    setShowOp(false);
  };

  return (
    <div>
      <h1>Finally Home{isAuthenticated ? ", " + userName : null}!</h1>
      {isAuthenticated ? (
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
          {userAdmin === true ? (
            <div>
              <br />
              <Link to="/admin">Do the admin job</Link>
            </div>
          ) : null}
          {showOp && operations.length > 0 ? (
            <div>
              <ul>
                {operations.map((op) => (
                  <MediaCard
                    key={op.id}
                    name={op.name}
                    text={op.text}
                    editableName={false}
                    editableText={true}
                  />
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}
