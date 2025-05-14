import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/axiosConfig';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface User {
  username: string;
  role: 'admin' | 'user';
  token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    alert("AuthProvider mounted");
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const username = decoded.username || decoded.email || decoded.sub || 'User';
        const role = decoded.role;
        console.log("Taken already in localStorage");
        console.log("Username:", username);
        console.log("Role:", role);
        console.log("Token:", token);

        setUser({ username, role, token });
        setToken(token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        console.error('Invalid token in localStorage');
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const username = decoded.username || decoded.email || decoded.sub || 'User';
      const role = decoded.role;
      console.log("New Login Token received");
      console.log("Username:", username);
      console.log("Role:", role);
      console.log("Token:", token);

      setUser({ username, role, token });
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.error('Invalid token');
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
