import axios from "axios";

const apiCall = axios.create({
    baseURL: "http://localhost:4000/",
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 40000,
  });
  
  export default apiCall

   