import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../content/assets/logo.png';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

interface NavItem {
  name: string;
  path: string;
}

interface PageOption {
  name: string;
  path: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isListboxOpen, setIsListboxOpen] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<PageOption | null>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { name: 'Accueil', path: '/' },
    { name: 'Acheter', path: '#' },
    { name: 'Louer', path: '/louer' },
    { name: 'Estimation', path: '/estimation' },
    { name: 'Investisseurs', path: '/investisseurs' },
    { name: 'Prix immobiliers', path: '/PrixImmobliers' },
    { name: 'Trouver un agent', path: '/TrouverAgent' },
  ];

  const pageOptions: PageOption[] = [{ name: 'Prix&Contacte', path: '/streetStats' }];

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleListbox = (): void => {
    setIsListboxOpen(!isListboxOpen);
  };

  const selectPage = (page: PageOption): void => {
    setSelectedPage(page);
    setIsListboxOpen(false);
    navigate(page.path);
  };

  useEffect(() => {
    const currentPageOption = pageOptions.find(page => page.path === location.pathname);
    if (currentPageOption) {
      setSelectedPage(currentPageOption);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (listboxRef.current && !listboxRef.current.contains(event.target as Node)) {
        setIsListboxOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsListboxOpen(false);
  }, [location.pathname]);
  const isPageActive = pageOptions.some(page => page.path === location.pathname);

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200" style={{ background: '#F9FAFB' }}>
      {/* Top Header Section */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="ImmoXpert" className="h-8 md:h-10 w-auto cursor-pointer" onClick={() => navigate('/')} />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center w-full px-6">
          {/* Navigation centered */}
          <div className="flex-1 flex justify-center space-x-6 items-center">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                <Link
                  to={item.path}
                  className={`text-gray-700 hover:text-primary transition ${location.pathname === item.path ? 'font-bold text-black' : ''}`}
                >
                  {item.name}
                </Link>
                {location.pathname === item.path && (
                  <div className="absolute left-0 right-0 -bottom-px h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-300" />
                )}
              </div>
            ))}

            {/* Pages dropdown */}
            <div className="relative" ref={listboxRef}>
              <button
                onClick={toggleListbox}
                className={`text-gray-700 hover:text-primary transition flex items-center space-x-1 ${
                  isPageActive ? 'font-bold text-black' : ''
                }`}
                aria-haspopup="listbox"
                aria-expanded={isListboxOpen}
              >
                <span>Pages</span>
                <FiChevronDown className={`transition-transform ${isListboxOpen ? 'rotate-180' : ''}`} size={16} />
              </button>

              {isPageActive && (
                <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-300" />
              )}

              {isListboxOpen && (
                <ul
                  className="absolute mt-1 w-40 bg-white shadow-lg rounded-lg py-1 z-50 border border-gray-200"
                  role="listbox"
                  aria-label="page"
                >
                  {pageOptions.map(page => (
                    <li
                      key={page.name}
                      role="option"
                      aria-selected={selectedPage?.name === page.name}
                      onClick={() => selectPage(page)}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition ${
                        selectedPage?.name === page.name ? 'bg-gray-50 font-medium' : ''
                      }`}
                    >
                      {page.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-white px-4 py-2 rounded-lg transition hover:opacity-90" style={{ background: '#7069F9' }}>
              Se connecter
            </button>
            <h1 className="text-sm font-bold border-2 p-2 px-4 rounded-xl" style={{ borderColor: '#7069F9' }}>
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Pack</span>{' '}
              <span className="bg-gradient-to-r from-purple-500 to-orange-300 bg-clip-text text-transparent">Pro</span>
            </h1>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-3">
          {/* Mobile Pack Pro Badge */}
          <div className="text-xs font-bold border-2 px-2 py-1 rounded-lg" style={{ borderColor: '#7069F9' }}>
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Pack</span>{' '}
            <span className="bg-gradient-to-r from-purple-500 to-orange-300 bg-clip-text text-transparent">Pro</span>
          </div>
          <button onClick={toggleMobileMenu} className="text-gray-700 focus:outline-none p-1">
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Gradient Line */}
      <div
        className="absolute left-6 right-6 h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-300"
        style={{ maskImage: 'linear-gradient(to right, white 60%, white 40%)' }}
      />

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100" style={{ zIndex: 40 }}>
          <nav className="flex flex-col p-4 space-y-1">
            {/* Navigation Items */}
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`py-3 px-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition ${
                  location.pathname === item.path ? 'font-bold text-black bg-gray-50' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Pages Dropdown */}
            <div className="relative">
              <button
                onClick={toggleListbox}
                className={`flex items-center justify-between w-full py-3 px-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition ${
                  isPageActive ? 'font-bold text-black bg-gray-50' : ''
                }`}
                aria-haspopup="listbox"
                aria-expanded={isListboxOpen}
              >
                <span>Pages</span>
                <FiChevronDown className={`transition-transform ${isListboxOpen ? 'rotate-180' : ''}`} size={16} />
              </button>

              {isListboxOpen && (
                <div className="mt-1 ml-4 space-y-1">
                  {pageOptions.map(page => (
                    <div
                      key={page.name}
                      onClick={() => {
                        selectPage(page);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`py-2 px-2 cursor-pointer hover:bg-gray-50 rounded-md transition ${
                        selectedPage?.name === page.name ? 'font-medium bg-gray-50' : ''
                      }`}
                    >
                      {page.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Connect Button */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <button
                className="w-full text-white px-4 py-3 rounded-lg transition hover:opacity-90"
                style={{ background: '#7069F9' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Se connecter
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
