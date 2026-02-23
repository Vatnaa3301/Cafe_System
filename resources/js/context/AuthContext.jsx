import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, logout as apiLogout, getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(() => {
        const stored = localStorage.getItem('cafe_user');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(true);

    // Validate token on mount
    useEffect(() => {
        const token = localStorage.getItem('cafe_token');
        if (token) {
            getMe()
                .then((u) => setUser(u))
                .catch(() => {
                    localStorage.removeItem('cafe_token');
                    localStorage.removeItem('cafe_user');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        const data = await apiLogin(credentials);
        localStorage.setItem('cafe_token', data.token);
        localStorage.setItem('cafe_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        await apiLogout().catch(() => {});
        localStorage.removeItem('cafe_token');
        localStorage.removeItem('cafe_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
