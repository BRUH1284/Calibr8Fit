import { createContext, useEffect, useState } from "react";
import { authService } from "../services/authService";


interface AuthContextProps {
    authenticated: boolean;
    isChecking: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                //const user = await authService.getCurrentUser();
                console.log("Starting authentication check...");
                
                // Simulate checking authentication for 5 seconds
                setTimeout(() => {
                    console.log("Authentication check completed");
                    setAuthenticated(false); // TODO: Change this based on actual auth result
                    setIsChecking(false); // Only set this to false after the check completes
                }, 2000);

            } catch (error) {
                console.log("Authentication check failed:", error);
                setAuthenticated(false);
                setIsChecking(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        await authService.login(username, password);

        return;
    }

    const register = async (username: string, password: string) => {
        await authService.register(username, password);

        return;
    }


    return (
    <AuthContext.Provider value={{ 
        authenticated, 
        isChecking,
        login,
        register
    }}>
      {children}
    </AuthContext.Provider>
  );
}