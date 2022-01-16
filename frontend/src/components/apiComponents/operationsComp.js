import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Auth from "../../auth";
import { useState, useEffect } from "react";
import {
  markOperation,
  unmarkOperation,
  modifyOperation,
} from "../../api/operationsApi";

const NameRow = (props) => {
  return (
    <Typography gutterBottom variant="h5" component="div">
      {props.value}
    </Typography>
  );
};

const TextRow = (props) => {
  return props.editable ? (
    <TextField
      label="Text"
      defaultValue={props.value}
      onChange={(event) => props.onChange(event.target.value)}
      onKeyPress={(event) => {
        if (event.key === "Enter") {
          props.onEnterKeyPress();
        }
      }}
    />
  ) : (
    <Typography variant="body2" color="text.secondary">
      {props.value}
    </Typography>
  );
};

export default function MediaCard(props) {
  // console.log("MediaCard:", props.initialValue);
  const [marked, setMarked] = useState(props.initialValue);
  const [background, setBackground] = useState(
    props.editable ? "fff" : props.initialValue === true ? "#bbddaa" : "#ddbbaa"
  );
  const [text, setText] = useState(props.text);
  const [modifying, setModifying] = useState(false);

  const handleMark = async () => {
    marked ? await unmarkOperation(props.id) : await markOperation(props.id);
    setBackground(!marked === true ? "#bbddaa" : "#ddbbaa");
    setMarked(!marked);
  };

  const handleModify = async () => {
    setModifying(true);
    return;
  };

  const handleModifySubmit = async () => {
    setModifying(false);
    await modifyOperation(props.id, text);
    await props.onChange();
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: 2,
        backgroundColor: background + " !important",
        border: 1,
        borderRadius: 2,
        boxShadow: 8,
      }}
    >
      <CardContent>
        <NameRow value={props.name} />
        <TextRow
          editable={props.editable || modifying}
          value={props.text}
          onChange={(value) => {
            if (props.editable === true) {
              props.onDirtyChange(value !== (props.text ?? ""));
            }
            setText(value);
          }}
          onEnterKeyPress={() => {
            if (props.editable) {
              props.onSubmit({ text: text });
            } else if (modifying) {
              handleModifySubmit();
            }
          }}
        />
      </CardContent>
      <CardActions>
        {props.editable ? (
          <Button size="small" onClick={() => props.onSubmit({ text: text })}>
            Submit
          </Button>
        ) : (
          <div>
            <Button size="small">
              {marked === true ? "Completed" : "Ongoing"}
            </Button>
            {Auth.getInstance().getMyUser().me.admin ? (
              <Button size="small" onClick={handleMark}>
                Mark
              </Button>
            ) : null}
            {Auth.getInstance().getMyUser().me.public_id === props.user_id ? (
              modifying === false ? (
                <Button size="small" onClick={() => handleModify()}>
                  Modify
                </Button>
              ) : (
                <Button size="small" onClick={() => handleModifySubmit()}>
                  Submit
                </Button>
              )
            ) : null}
          </div>
        )}
      </CardActions>
    </Card>
  );
}
