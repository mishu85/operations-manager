import { TheHttpClient } from "../TheHttpClient";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../auth";
import { Paper, TextField } from "@material-ui/core";
import Button from "@mui/material/Button";
import { useState } from "react";
import { flexbox } from "@mui/system";

export default function Signup() {
  let navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [checkPass, setCheckPass] = useState("");
  const [checked, setChecked] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name && password === checkPass) {
      const loginData = JSON.stringify({
        name: name,
        password: password,
      });
      const config = {
        body: loginData,
      };
      try {
        const response = await TheHttpClient().post("/user", {
          name: name,
          password: password,
        });
        if (response.status === 200) {
          Auth.getInstance().login(response.data);
          setChecked(true);
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        setName("");
        setPassword("");
        setCheckPass("");
        setChecked(false);
      }
    } else if (password !== checkPass) {
      setPassword("");
      setCheckPass("");
      setChecked(false);
      console.log("False in function");
    }
  };

  return (
    <div style={{ background: "#fffaaa" }}>
      <h1>Signup here</h1>

      <div style={{ color: "red", display: "flex", margin: 20 }}>
        <Link to="/">Home</Link>
        <form onSubmit={handleSubmit} style={{ display: "flex", margin: 20 }}>
          <Paper elevation={10}>
            <TextField
              label="Choose your name"
              placeholder="e.g. Valentine"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              type="password"
              label="Set your password"
              placeholder="Set your password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <TextField
              type="password"
              label="Re-type your password"
              required
              value={checkPass}
              onChange={(e) => {
                setCheckPass(e.target.value);
              }}
            />

            <Button fullWidth variant="contained" type="submit">
              Signup
            </Button>
          </Paper>
        </form>
        <div>
          {checked === false ? (
            <p>Password and checker are not identical</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
