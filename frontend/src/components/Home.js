import React from "react";
import { Link } from "react-router-dom";
import Auth from "../auth";
import { TheHttpClient } from "../TheHttpClient";
import { useState } from "react";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [userPublicId, setUserPublicId] = useState("");
  const [userAdmin, setUserAdmin] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(
    Auth.getInstance().isAuthenticated()
  );

  const handleTest = async () => {
    const response = await TheHttpClient().get(
      "/user/299b534c-96a8-4cc7-a8ab-1e0bfbdd541f"
    );
    console.log(response.data);
  };

  return (
    <div>
      <h1>Finally Home!</h1>
      {isAuthenticated ? (
        <div>
          <button onClick={handleTest}>Text if working</button>
          <button
            onClick={() => {
              Auth.getInstance().logout();
              setIsAuthenticated(false);
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}
