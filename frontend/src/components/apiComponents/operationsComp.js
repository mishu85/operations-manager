import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const NameRow = (props) => {
  return props.editable ? (
    <TextField label="Name" defaultValue={props.value} />
  ) : (
    <Typography gutterBottom variant="h5" component="div">
      {props.value}
    </Typography>
  );
};

const TextRow = (props) => {
  return props.editable ? (
    <TextField label="Text" defaultValue={props.value} />
  ) : (
    <Typography variant="body2" color="text.secondary">
      {props.value}
    </Typography>
  );
};

export default function MediaCard(props) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <NameRow editable={props.editableName} value={props.name} />
        <TextRow editable={props.editableText} value={props.text} />
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
