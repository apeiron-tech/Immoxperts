import React from 'react';
import { Navigate } from 'react-router-dom';
import type { UserRole } from 'app/config/proNavigation';
import { useAuth } from './useAuth';
import { proRoutes } from 'app/config/proRoutes';

interface RoleGuardProps {
  allow: UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allow, fallback, children }) => {
  const { role, isLoading } = useAuth();
  if (isLoading) return null;
  if (!allow.includes(role)) {
    if (fallback !== undefined) return <>{fallback}</>;
    return <Navigate to={proRoutes.tableauDeBord} replace />;
  }
  return <>{children}</>;
};

export default RoleGuard;
