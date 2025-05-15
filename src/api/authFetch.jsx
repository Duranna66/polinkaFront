import axios from "axios";
import config from "../config.js";

const API = axios.create({
    baseURL: config.apiBaseUrl,
});

// Если нужен токен:
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;