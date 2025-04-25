// src/context/userContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('userInfo');
      }
    }
  }, []);

  const login = (userData: User) => {
    // Save user data to localStorage
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('userToken', userData.token);
    setUser(userData);
  };

  const logout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};