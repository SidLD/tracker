import axios from "axios";

const _axios = axios.create({
    baseURL: 'http://localhost:3000/',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, 
  });

export default _axios;
  
  