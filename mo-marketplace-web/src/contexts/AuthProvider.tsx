import { useState, type ReactNode } from 'react';
import { authAPI } from '../api/client';
import { AuthContext, type User } from './AuthContext'; 

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const token = localStorage.getItem('access_token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch {
                return null;
            }
        }
        return null;
    });

    const [isLoading, setIsLoading] = useState(false); 

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const res = await authAPI.login({ email, password });
            const { access_token, user: userData } = res.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const res = await authAPI.register({ email, password });
            const { access_token, user: userData } = res.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user, isLoading, login, register, logout,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
