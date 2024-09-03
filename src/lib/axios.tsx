import axios from "axios";

const _axios = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, 
  });

export default _axios;
  
  