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

const Vari = "Blabla";

export { getAllOperations, Vari };
