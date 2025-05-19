import axios from "axios";
import env from "../config/env";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
    baseURL: env.SERVER_URL,
    headers:{
        'Content-Type': 'application/json'
    }
});
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
)

export default api;