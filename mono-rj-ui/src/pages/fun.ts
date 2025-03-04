import axios from 'axios';
import {jwtDecode} from "jwt-decode";


// Create an axios instance
export const axiosInstance = axios.create({
    // You can set a base URL or other global settings here
    baseURL: process.env.REACT_APP_API_BASE_URL || '',
});

// Function to check if the token is expired
const isTokenExpired = (token: string | null) => {
    if (!token) return true;
    try {
        const decoded: any = jwtDecode(token);
        return decoded.exp * 1000 < Date.now(); // Convert `exp` to milliseconds
    } catch (error) {
        return true; // Treat invalid tokens as expired
    }
};

// Function to refresh the access token
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/refresh`, {
            refreshToken
        });

        const newAccessToken = response.data.accessToken;
        localStorage.setItem("jwtToken", newAccessToken);

        return newAccessToken;
    } catch (error) {
        console.error("Token refresh failed, logging out...");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "mono/login"; // Redirect to login page
        return null;
    }
};

// Set up the interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem("jwtToken");

        // Check if token is expired
        if (token && isTokenExpired(token)) {
            console.log("Access token expired, attempting refresh...");
            token = await refreshAccessToken();
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error); // Don't handle 401s here, move it to response interceptor
    }
);

// ✅ Handle 401 errors in response interceptor
axiosInstance.interceptors.response.use(
    (response) => response, // Pass successful responses through
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("JWT expired or invalid. Redirecting to login...");
            localStorage.removeItem("jwtToken"); // Clear expired token
            localStorage.removeItem("refreshToken");
            window.location.href = "/mono/login"; // Redirect to correct login page
        }
        return Promise.reject(error);
    }
);
