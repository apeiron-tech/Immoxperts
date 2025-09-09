import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../content/assets/logo.png';

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
    { name: 'Trouver un agent', path: '/TrouverAgent' },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50'
            : 'bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100'
        }`}
      >
        {/* Top Header Section */}
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img src={logo} alt="ImmoXpert" className="h-8 md:h-10 w-auto transform transition-transform duration-200 hover:scale-105" />
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
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <div key={index} className="relative group">
                  <Link
                    to={item.path}
                    className={`relative px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      location.pathname === item.path ? 'text-gray-900 font-semibold' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                    {location.pathname === item.path && (
                      <div className="absolute left-0 right-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-300" />
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
              {/* Bouton Se connecter */}
              <button
                className="relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-white  hover:from-blue-700 hover:to-purple-700 shadow-lg"
                style={{ backgroundColor: '#7069F9' }}
                onClick={() => navigate('/login')}
              >
                <span className="relative">Se connecter</span>
              </button>

              {/* Bouton Pack Pro */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative text-sm font-bold border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border p-2 px-6 rounded-2xl backdrop-blur transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg">
                  <div className="absolute inset-0 bg-white rounded-2xl" />
                  <div className="relative flex items-center space-x-2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">Pack</span>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-bold">Pro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

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
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`block py-4 px-4 rounded-xl text-base font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-purple-700 ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 font-semibold'
                        : 'text-gray-700'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

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

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-20" />
    </>
  );
};

export default Header;
