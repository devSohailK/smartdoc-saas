import axios from 'axios'
import { useAuthStore } from '../store/authStore';
import { navigate } from '@reach/router';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type" : "application/json",

    },
});


api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);



api.interceptors.response.use(
    (response) => response,
    (error) => {
        const currentPath = window.location.pathname;
        if (error.response?.status === 401 && currentPath != '/auth') {
            useAuthStore.getState().logout();
            navigate('/auth');
        }
        return Promise.reject(error);
    }
);

export default api;
