import axios from "axios";
import { URL } from "../resources/variables";

export default function authenticate(username, password) {
  const payload = {
    username: username,
    password: password
  };

  const authenticateURL = URL + "users/authenticate";
  return axios(authenticateURL, {
    method: "post",
    data: payload,
    withCredentials: true
  });
}
