import React, { createContext, useContext, useState } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { Role, User } from '../types';

interface AuthContextType {
  currentUser: User;
  currentRole: Role;
  switchRole: (role: Role) => void;
  login: (email: string) => boolean;
  logout: () => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Default to Prosper (Admin) for full feature review

  const currentRole = currentUser.role;

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

  const logout = () => {
    setCurrentUser(MOCK_USERS[2]); // Switch back to Client Alice
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        login,
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
