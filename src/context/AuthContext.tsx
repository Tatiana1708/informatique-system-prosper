import React, { createContext, useContext, useEffect, useState } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { api } from '../services/api';
import { Role, User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  currentRole: Role;
  isAuthenticated: boolean;
  switchRole: (role: Role) => void;
  login: (email: string) => boolean;
  loginApi: (email: string, password?: string) => Promise<User>;
  registerApi: (nom: string, email: string, password?: string, role?: string) => Promise<User>;
  logout: () => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('isp_user_session');
      if (saved && saved !== 'null') return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('isp_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('isp_user_session');
    }
  }, [currentUser]);

  const currentRole: Role = currentUser ? currentUser.role : 'Client';
  const isAuthenticated = currentUser !== null;

  const switchRole = (role: Role) => {
    const userForRole = MOCK_USERS.find((u) => u.role === role) || {
      id: 'u-temp',
      nom: `Utilisateur ${role}`,
      email: `${role.toLowerCase()}@informatiquesystem.com`,
      role,
      statut: 'Actif',
      dateInscription: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(userForRole);
  };

  const login = (email: string) => {
    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const loginApi = async (email: string, password?: string): Promise<User> => {
    const res = await api.login(email, password);
    setCurrentUser(res.user);
    return res.user;
  };

  const registerApi = async (nom: string, email: string, password?: string, role?: string): Promise<User> => {
    const res = await api.register({ nom, email, password, role });
    setCurrentUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('isp_user_session');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        switchRole,
        login,
        loginApi,
        registerApi,
        logout,
        allUsers: MOCK_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
