
import { AuthResponse, UserResponse } from "../models/auth.model";
import axios from "axios";
import { api } from "../../config/api";

const API_URL = "https://api-ecommerce-5aby.onrender.com";

export const AuthService = {

    login: async (
        email: string,
        password: string
    ): Promise<AuthResponse> => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            return response.data;

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(
                    error.response.data?.message ||
                    "Error al iniciar sesión"
                );
            }

            throw new Error("Error del servidor");
        }
    },

    register: async (
        name: string,
        lastname: string,
        phone: string,
        email: string,
        password: string
    ) => {
        try {
            const response = await api.post("/auth/register", {
                name,
                lastname,
                phone,
                email,
                password
            });

            console.log(response.data);

        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(
                    error.response.data?.message ||
                    error.response.data?.Message ||
                    "Error del servidor al registrarse"
                );
            }

            throw new Error("Error del servidor");
        }
    },

    updateUser: async (
        userId: number,
        name: string,
        lastname: string,
        phone: string,
        token: string
    ): Promise<UserResponse> => {
        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("lastname", lastname);
            formData.append("phone", phone);

            const authTokenHeader = token.startsWith("Bearer")
                ? token
                : `Bearer ${token}`;

            const response = await api.put(
                `/users/upload/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: authTokenHeader,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            return response.data;

        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(
                    error.response.data?.message || "Error al actualizar usuario"
                );
            }

            throw new Error("Error del servidor");
        }
    },

    validateToken: async (token: string): Promise<boolean> => {
        try {
            const header = token.startsWith("Bearer")
                ? token
                : `Bearer ${token}`;

            const { data } = await axios.get(
                `${API_URL}/auth/validate`,
                {
                    headers: {
                        Authorization: header
                    },
                    timeout: 10000
                }
            );

            return data.valid === true;

        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 401
            ) {
                return false;
            }

            throw error;
        }
    }
};
