import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { publicNavigation, proMarketingNavigation } from 'app/config/publicNavigation';
import PublicLogo from './PublicLogo';

export type PublicHeaderVariant = 'standard' | 'marketing-pro';

interface Props {
  variant?: PublicHeaderVariant;
}

const PublicHeader: React.FC<Props> = ({ variant = 'standard' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const nav = variant === 'marketing-pro' ? proMarketingNavigation : publicNavigation;
  const isPro = variant === 'marketing-pro';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white">
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            <PublicLogo variant={isPro ? 'pro' : 'standard'} to="/" />

            <nav className="hidden md:flex items-center gap-1">
              {nav.map(item => {
                const active = !item.href.startsWith('#') && location.pathname === item.href;
                if (item.href.startsWith('#')) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className="px-3 h-9 flex items-center text-[13.5px] text-neutral-600 hover:text-neutral-900 transition-colors rounded-md"
                    >
                      {item.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`px-3 h-9 flex items-center text-[13.5px] transition-colors rounded-md ${
                      active ? 'text-propsight-700 font-medium' : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-1.5">
              {isPro ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/app/tableau-de-bord')}
                    className="h-9 inline-flex items-center px-3.5 rounded-lg text-[13.5px] font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  >
                    Se connecter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('contact');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="h-9 inline-flex items-center px-4 rounded-lg text-[13.5px] font-medium text-white bg-propsight-600 hover:bg-propsight-700 transition-colors"
                  >
                    Demander une démo
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/pro"
                    className="h-9 inline-flex items-center px-3.5 rounded-lg text-[13.5px] font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  >
                    Espace Pro
                  </Link>
                  <button
                    type="button"
                    onClick={() => navigate('/estimation')}
                    className="h-9 inline-flex items-center px-4 rounded-lg text-[13.5px] font-medium text-white bg-propsight-600 hover:bg-propsight-700 transition-colors"
                  >
                    Explorer gratuitement
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              className="md:hidden w-9 h-9 rounded-md hover:bg-neutral-100 text-neutral-700 flex items-center justify-center"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Fermer' : 'Menu'}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {/* Signature gradient bar — Propsight identity */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
          style={{ background: 'var(--ps-signature-gradient)' }}
        />
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-white border-t border-neutral-200">
          <div className="px-5 py-6 flex flex-col gap-1">
            {nav.map(item =>
              item.href.startsWith('#') ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="h-11 flex items-center px-3 rounded-lg text-[15px] text-neutral-700 hover:bg-neutral-50"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="h-11 flex items-center px-3 rounded-lg text-[15px] text-neutral-700 hover:bg-neutral-50"
                >
                  {item.label}
                </Link>
              ),
            )}
            <div className="h-px bg-neutral-200 my-3" />
            {isPro ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/app/tableau-de-bord')}
                  className="h-11 rounded-lg text-[15px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  className="h-11 rounded-lg text-[15px] font-medium text-white bg-propsight-600 hover:bg-propsight-700"
                >
                  Demander une démo
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/pro"
                  className="h-11 flex items-center justify-center rounded-lg text-[15px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
                >
                  Espace Pro
                </Link>
                <button
                  type="button"
                  onClick={() => navigate('/estimation')}
                  className="h-11 rounded-lg text-[15px] font-medium text-white bg-propsight-600 hover:bg-propsight-700"
                >
                  Explorer gratuitement
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PublicHeader;
