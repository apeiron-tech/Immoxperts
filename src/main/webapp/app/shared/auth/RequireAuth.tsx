import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from 'app/config/store';

// Mettre à `false` pour réactiver le contrôle de session.
const BYPASS_AUTH = true;

const AuthLoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex items-center gap-3 text-sm text-neutral-500">
      <div className="h-4 w-4 rounded-full border-2 border-neutral-300 border-t-violet-500 animate-spin" />
      Chargement de votre session…
    </div>
  </div>
);

export const RequireAuth: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const sessionHasBeenFetched = useAppSelector(state => state.authentication.sessionHasBeenFetched);
  const location = useLocation();

  if (BYPASS_AUTH) {
    return <Outlet />;
  }

  if (!sessionHasBeenFetched) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
