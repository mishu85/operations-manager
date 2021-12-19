import { Link, useNavigate } from "react-router-dom";
import { TheHttpClient } from "../TheHttpClient";
import Auth from "../auth";
import { Paper, TextField } from "@material-ui/core";
import Button from "@mui/material/Button";
import { useState } from "react";
import { flexbox } from "@mui/system";

export default function Login() {
  let navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = async (event) => {
    event.preventDefault();
    const authorizationBasic = window.btoa(name + ":" + password);
    const config = {
      headers: {
        Authorization: "Basic " + authorizationBasic,
      },
    };
    try {
      const response = await TheHttpClient().get("/login", config);
      if (response.status == 200) {
        Auth.getInstance().login(response.data);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setName("");
      setPassword("");
    }
  };

  const handleSignup = () => {
    Auth.getInstance().isAuthenticated() ? navigate("/") : navigate("/signup");
  };

  return (
    <div>
      <h1>Login page!</h1>

      <div style={{ color: "red", display: "flex", margin: 20 }}>
        <Link to="/">Home</Link>
        <form onSubmit={handleClick} style={{ display: "flex", margin: 20 }}>
          <Paper elevation={10}>
            <TextField
              label="Name"
              placeholder="Type your name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              type="password"
              label="Password"
              placeholder="Check password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Button fullWidth variant="contained" type="submit">
              Login
            </Button>
          </Paper>
        </form>
        <Button onClick={handleSignup}>Signup</Button>
      </div>
    </div>
  );
}

//<button onClick={handleClick}>Login</button>
