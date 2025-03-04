import React, { createContext, useContext, useState, ReactNode } from "react";

interface MonoRJAppContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const MonoRJAppContext = createContext<MonoRJAppContextType | undefined>(undefined);

export const MonoRJAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return (
        <MonoRJAppContext.Provider value={{ isAuthenticated, login, logout }}>
    {children}
    </MonoRJAppContext.Provider>
);
};

export const useAppMonoRJContext = () => {
    const context = useContext(MonoRJAppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
