import axios from "axios";
import Auth from "./auth";

const serverAddress = "http://127.0.0.1:5000";

const TheHttpClient = () => {
  let client = axios.create({ baseURL: serverAddress });
  if (Auth.getInstance().isAuthenticated()) {
    client.defaults.headers.common["x-access-token"] =
      Auth.getInstance().getMyUser().token;
  }
  return client;
};

export { TheHttpClient, serverAddress };
