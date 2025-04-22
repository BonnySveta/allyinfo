import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL; 
  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }
      
      const { token } = await response.json();
      localStorage.setItem('authToken', token);
      setIsAdmin(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAdmin(false);
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/verify-token', {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setIsAdmin(true);
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 