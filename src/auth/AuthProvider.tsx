import { useContext, createContext, useState, useEffect } from "react";

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuthenticated: false,
    externalToken: "",
    setExternalToken: (token: string) => {},
    saveUserData: (userData: any) => {},
    logout: () => {},
});

export function AuthProvider({children} : AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [externalToken, setExternalToken] = useState<string>("");

    function saveUserData(userData: any) {
        console.log("Saving user data: ", userData);
        console.log("Setting isAuthenticated to true");
        setIsAuthenticated(true);
    }

    function logout() {
        console.log("Logging out");
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated, 
            saveUserData, 
            logout, 
            externalToken, 
            setExternalToken, 
        }}>
            {children}
        </AuthContext.Provider>
    )
}

// This is a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);