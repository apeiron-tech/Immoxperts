import React from 'react';
import { Link } from 'react-router-dom';
import logoSrc from '../../../../content/assets/propsight-logo.png';

interface Props {
  variant?: 'standard' | 'pro';
  to?: string;
}

const PublicLogo: React.FC<Props> = ({ variant = 'standard', to = '/' }) => (
  <Link to={to} className="inline-flex items-center gap-2 group">
    <img
      src={logoSrc}
      alt="Propsight"
      className="h-8 w-auto"
    />
    {variant === 'pro' && (
      <span className="inline-flex items-center h-[18px] px-1.5 rounded bg-propsight-50 text-propsight-700 text-[10px] font-semibold tracking-wide">
        PRO
      </span>
    )}
  </Link>
);

export default PublicLogo;
