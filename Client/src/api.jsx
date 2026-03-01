import axios from 'axios';

const api = axios.create({
    baseURL: 'https://legalmind-backend-6meh.onrender.com',
    withCredentials: true,
});

export default api;