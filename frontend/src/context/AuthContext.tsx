import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  login: (email: string) => Promise<UserProfile>;
  register: (data: Partial<UserProfile>) => Promise<UserProfile>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nexprep_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexprep_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexprep_user');
    }
  }, [user]);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(data);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexprep_user');
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      const updated = {
        ...user,
        role: newRole,
        full_name: newRole === 'admin' ? 'Administrator' : 'Student Candidate',
        email: newRole === 'admin' ? 'admin@nexprep.io' : 'student@nexprep.io'
      };
      setUser(updated);
    } else {
      setUser({
        id: newRole === 'admin' ? 'demo-admin-id' : 'demo-student-id',
        email: newRole === 'admin' ? 'admin@nexprep.io' : 'student@nexprep.io',
        full_name: newRole === 'admin' ? 'Administrator' : 'Student Candidate',
        role: newRole,
        skills: ['Software Engineering', 'Evaluation'],
        target_role: newRole === 'admin' ? 'Placement Director' : 'Software Engineer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    setIsLoading(true);
    try {
      const updated = await api.auth.updateProfile(user.id, data);
      setUser(updated);
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isLoading,
        login,
        register,
        logout,
        switchRole,
        updateProfile
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
