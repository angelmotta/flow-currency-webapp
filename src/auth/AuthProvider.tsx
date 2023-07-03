import { useContext, createContext, useState, useEffect } from "react";

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuthenticated: false,
});

export function AuthProvider({children} : AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

// This is a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);