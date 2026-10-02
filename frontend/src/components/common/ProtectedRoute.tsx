import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRole?: UserRole;
}> = ({ children, allowedRole }) => {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFAFF]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D28D9]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }

  return <>{children}</>;
};
