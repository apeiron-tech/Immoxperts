import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Building2, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { useAuth } from 'app/shared/auth/useAuth';
import { proRoutes } from 'app/config/proRoutes';
import { useZoneStore } from 'app/shared/stores/zoneStore';

const UserMenu: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : user?.login ?? 'Utilisateur';
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('');

  const handleLogout = () => {
    setOpen(false);
    dispatch(logout());
    useZoneStore.persist.clearStorage();
    navigate('/');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="h-9 pl-1 pr-2.5 rounded-md hover:bg-neutral-50 flex items-center gap-2 transition-colors"
      >
        <div className="w-7 h-7 rounded-md bg-propsight-100 text-propsight-700 text-[11px] font-semibold flex items-center justify-center">
          {initials || 'PR'}
        </div>
        <div className="text-left leading-tight hidden md:block">
          <div className="text-[12px] font-medium text-neutral-900">{displayName}</div>
          <div className="text-[11px] text-neutral-500">{user?.email ?? ''}</div>
        </div>
        <ChevronDown size={13} className="text-neutral-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-neutral-200 rounded-md shadow-md z-50 py-1">
          <Link
            to={proRoutes.parametres.compte}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <User size={14} />
            Mon profil
          </Link>
          <Link
            to={proRoutes.parametres.organisation}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <Building2 size={14} />
            Mon organisation
          </Link>
          <Link
            to={proRoutes.parametres.root}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <Settings size={14} />
            Paramètres
          </Link>
          <div className="border-t border-neutral-200 my-1" />
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
