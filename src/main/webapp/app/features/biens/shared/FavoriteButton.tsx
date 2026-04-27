import React from 'react';
import { Heart } from 'lucide-react';

interface Props {
  active: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
  variant?: 'ghost' | 'outlined';
}

const FavoriteButton: React.FC<Props> = ({ active, onToggle, size = 'md', variant = 'outlined' }) => {
  const dim = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  const icon = size === 'sm' ? 13 : 14;

  const base = variant === 'outlined'
    ? 'border border-slate-200 bg-white hover:bg-slate-50'
    : 'hover:bg-slate-100';

  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(); }}
      className={`${dim} ${base} rounded-md flex items-center justify-center transition-colors`}
      aria-label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        size={icon}
        className={active ? 'text-propsight-600 fill-propsight-600' : 'text-slate-400'}
      />
    </button>
  );
};

export default FavoriteButton;
