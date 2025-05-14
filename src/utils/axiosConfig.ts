// // src/utils/axiosConfig.ts
// import axios from 'axios';

// // Create an Axios instance
// const api = axios.create({
//   baseURL: '/api',
// });

// // Automatically attach the JWT token to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust base URL to match backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;