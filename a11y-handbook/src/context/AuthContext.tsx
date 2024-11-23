import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  const login = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  // Добавляем утилиты в window для доступа из консоли
  useEffect(() => {
    (window as any).adminUtils = {
      login,
      logout,
      isAdmin: () => isAdmin
    };
  }, [isAdmin]);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
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