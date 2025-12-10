// frontend/src/context/AuthContext.tsx
import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import { type AuthUser } from '../types/Hero';
import { loginUser, registerUser, checkAuth } from '../api/authApi';

// 1. Définir le type du contexte
interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

// 2. Créer le Contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Fournisseur de Contexte (Provider)
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Vérifier l'authentification au chargement de l'app
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const userData = await checkAuth();
                if (userData) {
                    setUser(userData);
                    setToken(localStorage.getItem('token'));
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'auth:', error);
            } finally {
                setLoading(false);
            }
        };
        
        verifyAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const { token: newToken, user: userData } = await loginUser({ username, password });
            
            setToken(newToken);
            setUser(userData);
            setIsAuthenticated(true);
            
            // Stocker dans localStorage
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));
            
            console.log('Login réussi, utilisateur:', userData);
        } catch (error: any) {
            console.error('Erreur lors du login:', error.message);
            throw error;
        }
    };

    const register = async (username: string, password: string) => {
        try {
            const { token: newToken, user: userData } = await registerUser({ username, password });
            
            setToken(newToken);
            setUser(userData);
            setIsAuthenticated(true);
            
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error: any) {
            console.error('Erreur lors de l\'inscription:', error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            isAuthenticated, 
            login, 
            register, 
            logout, 
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Hook personnalisé pour consommer le Contexte
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};