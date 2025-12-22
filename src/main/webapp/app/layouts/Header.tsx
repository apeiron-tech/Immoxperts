import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../content/assets/Design sans titre.png';

interface NavItem {
  name: string;
  path: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems: NavItem[] = [
    { name: 'Acheter', path: '/acheter' },
    { name: 'Louer', path: '/louer' },
    { name: 'Estimation', path: '/estimation' },
    { name: 'Investisseurs', path: '/investisseurs' },
    { name: 'Prix immobiliers', path: '/PrixImmobliers' },
    { name: 'À propos', path: '/TrouverAgent' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-200 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        {/* Top Header Section */}
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img
                src={logo}
                alt="Propsight"
                className="h-8 md:h-10 lg:h-10 w-auto transform transition-transform duration-200 hover:scale-105"
              />
              <span
                className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold transition-opacity duration-200 whitespace-nowrap inline-block ${
                  location.pathname === '/pack-pro' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{
                  backgroundColor: 'hsl(245 58% 62% / 0.15)',
                  color: 'hsl(245 58% 62%)',
                  width: '48px', // Fixed width to prevent layout shift
                  textAlign: 'center',
                }}
              >
                PRO
              </span>
            </div>

            {/* Hamburger for mobile */}
            <button
              className="md:hidden flex items-center px-3 py-2 border rounded text-gray-700 border-gray-300 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path && location.pathname !== '/';
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-lg ${
                      isActive ? 'bg-gray-100 text-purple-700' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
              {/* Bouton Se connecter */}
              <button
                className="px-6 py-2.5 rounded-lg font-medium text-sm text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#7069F9' }}
                onClick={() => navigate('/login')}
              >
                Se connecter
              </button>

              {/* Bouton Pack Pro */}
              <button
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-90 ${
                  location.pathname === '/pack-pro' ? 'text-white' : 'border-2 text-[#7069F9]'
                }`}
                style={
                  location.pathname === '/pack-pro'
                    ? { backgroundColor: '#7069F9' }
                    : {
                        borderColor: '#7069F9',
                        backgroundColor: 'white',
                        color: '#7069F9',
                      }
                }
                onClick={() => navigate('/pack-pro')}
              >
                Pack Pro
              </button>
            </div>
          </div>
        </div>
      </header>
      <div
        className="fixed top-0 left-0 right-0 z-50 w-full h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-300"
        style={{ marginTop: '73px' }}
      />

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />

          {/* Menu Panel */}
          <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-b border-gray-200/50">
            <div className="pt-20 pb-6">
              <nav className="px-6 space-y-2">
                {/* Navigation Items */}
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path && location.pathname !== '/';
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className={`block py-4 px-4 rounded-xl text-base font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-purple-700 ${
                        isActive ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 font-semibold' : 'text-gray-700'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                {/* Mobile Connect Button */}
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <button
                    className="w-full py-4 px-6 rounded-xl font-medium text-base transition-all duration-300 transform hover:scale-105 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                  >
                    Se connecter
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
