import React from 'react';
import { User } from '../../types';

interface Props {
  user?: User;
  size?: 'xs' | 'sm' | 'md';
}

const AvatarUser: React.FC<Props> = ({ user, size = 'sm' }) => {
  const dim = size === 'xs' ? 'h-5 w-5 text-[9px]' : size === 'md' ? 'h-7 w-7 text-[11px]' : 'h-6 w-6 text-[10px]';
  if (!user) {
    return (
      <span className={`inline-flex items-center justify-center rounded-full bg-slate-200 text-slate-500 font-medium ${dim}`}>
        —
      </span>
    );
  }
  const initials = `${user.prenom[0] || ''}${user.nom[0] || ''}`;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full text-white font-semibold ${dim}`}
      style={{ backgroundColor: user.color }}
    >
      {initials}
    </span>
  );
};

export default AvatarUser;
