import { TheHttpClient } from "../TheHttpClient";

async function getAllOperations() {
  try {
    let response = await TheHttpClient().get("/operations");
    console.log("response.data.operations:", response.data.operations);
    console.log("response:", response);
    return response.data.operations;
  } catch (error) {
    console.log(error);
  }
  return;
}

async function markOperation(op_id) {
  const resp = await TheHttpClient().get("/operations/" + op_id + "/complete");
  console.log(resp.data);
  return;
}

async function unmarkOperation(op_id) {
  const resp = await TheHttpClient().get("/operations/" + op_id + "/ongoing");
  console.log(resp.data);
  return;
}

async function postOperation(op) {
  const resp = await TheHttpClient().post("/operations", { text: op });
  console.log("respOP:", resp);
}

async function receiveData() {
  const resp = await TheHttpClient().get("/data");
  return resp.data.data;
}

async function changeRole(public_id, role) {
  if (role === "Admin") {
    const resp = await TheHttpClient()
      .put("/user/declass/" + public_id)
      .then(console.log("Declassed"));
  } else if (role === "User") {
    const resp = await TheHttpClient()
      .put("/user/" + public_id)
      .then(console.log("Promoted"));
  }
}

async function getUserOperations(user_id) {
  const resp = await TheHttpClient().get("/userops/" + user_id);
  // console.log("opsApi:", resp.data.data);
  return resp.data.data;
}

async function deleteOperation(op_id) {
  await TheHttpClient().delete("/operations/" + op_id);
  return;
}

async function modifyOperation(op_id, text) {
  await TheHttpClient().put("/operations/" + op_id, { text: text });
  return;
}

const Vari = "Blabla";

export {
  getAllOperations,
  Vari,
  markOperation,
  unmarkOperation,
  postOperation,
  receiveData,
  changeRole,
  getUserOperations,
  deleteOperation,
  modifyOperation,
};
