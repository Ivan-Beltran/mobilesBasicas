import { UserResponse } from "../auth/models/auth.model"
import { createContext, useEffect, useState, useContext, useCallback } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from "../auth/services/auth.service";
import { setClearSessionCallback } from "../config/api";

interface AuthContextType {
    token: string | null
    user: UserResponse | null
    isLoadingSession: boolean
    saveSession: (token: string, user: UserResponse) => Promise<void>
    clearSession: () => void
    updateUserSession: (updateUser: UserResponse) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<UserResponse | null>(null)
    const [isLoadingSession, setIsLoadingSession] = useState(true)

    useEffect(() => {
        const loadSession = async () => {
            try {
                const savedToken = await AsyncStorage.getItem("@Auth_token")
                const savedUser = await AsyncStorage.getItem("@Auth_user")
                if (savedToken && savedUser) {
                    try {
                        const isValid = await AuthService.validateToken(savedToken)
                        if (isValid) {
                            setToken(savedToken)
                            setUser(JSON.parse(savedUser))
                        } else {
                            await AsyncStorage.multiRemove(["@Auth_token", "@Auth_user"])
                        }
                    } catch (error) {
                        setToken(savedToken)
                        setUser(JSON.parse(savedUser))
                    }
                }
            } catch (error) {
                console.log("Error al cargar la session")
            } finally {
                setIsLoadingSession(false)
            }
        }

        loadSession();
    }, [])

    const saveSession = async (newToken: string, newUser: UserResponse) => {
        try {
            await AsyncStorage.setItem("@Auth_token", newToken)
            await AsyncStorage.setItem("@Auth_user", JSON.stringify(newUser))
            console.log("se guardo la session")
            setToken(newToken)
            setUser(newUser)
        } catch (error) {
            console.log("error al persistir  la data", error)
        }
    }

    const updateUserSession = async (updateUser: UserResponse) => {
        try {
            await AsyncStorage.setItem("@Auth_user", JSON.stringify(updateUser))
            setUser(updateUser)

        } catch (error) {
            console.log("error al actualizar la data", error)
        }
    }

    const clearSession = useCallback(async () => {
        try {
            await AsyncStorage.multiRemove([
                "@Auth_token",
                "@Auth_user"
            ]);

            console.log("Se cerró la sesión");

        } catch (error) {
            console.log("Error al cerrar la sesión", error);

        } finally {
            setToken(null);
            setUser(null);
        }
    }, []);

    useEffect(() => {
        setClearSessionCallback(clearSession);

        return () => {
            setClearSessionCallback(null);
        };
    }, [clearSession]);

    return <AuthContext.Provider value={{ token, user, isLoadingSession, saveSession, updateUserSession, clearSession }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)