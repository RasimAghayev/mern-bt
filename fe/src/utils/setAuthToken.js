import axios from "axios";

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-api-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-api-token"];
  }
};

export default setAuthToken;
