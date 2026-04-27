import { useAppSelector } from 'app/config/store';
import type { UserRole } from 'app/config/proNavigation';

const ROLE_PRIORITY: UserRole[] = ['ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_VIEWER'];

// Tant que l'auth réelle n'est pas branchée (RequireAuth.BYPASS_AUTH=true),
// pas de session => on simule un OWNER pour exposer l'expérience complète
// (sinon les sections gated par `roles` comme Équipe sont invisibles en démo).
const pickHighestRole = (authorities?: string[]): UserRole => {
  if (!authorities || authorities.length === 0) return 'ROLE_OWNER';
  for (const role of ROLE_PRIORITY) {
    if (authorities.includes(role)) return role;
  }
  return 'ROLE_VIEWER';
};

export const useAuth = () => {
  const account = useAppSelector(state => state.authentication.account);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const sessionHasBeenFetched = useAppSelector(state => state.authentication.sessionHasBeenFetched);

  return {
    user: account,
    role: pickHighestRole(account?.authorities),
    isAuthenticated,
    isLoading: !sessionHasBeenFetched,
  };
};
