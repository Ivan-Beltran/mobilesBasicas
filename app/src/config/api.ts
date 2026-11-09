
import axios from "axios";

export const api = axios.create({
    baseURL: "https://api-ecommerce-5aby.onrender.com",
    timeout: 10000
});

// Callback para conectar Axios con AuthContext
let clearSessionCallback: (() => Promise<void>) | null = null;

export const setClearSessionCallback = (
    callback: (() => Promise<void>) | null
) => {
    clearSessionCallback = callback;
};

// Interceptor de respuestas
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {

        if (
            error.response?.status === 401 &&
            !error.config?.url?.includes("/auth/login")
        ) {
            await clearSessionCallback?.();
        }

        return Promise.reject(error);
    }
);
