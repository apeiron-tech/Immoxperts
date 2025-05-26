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

  const pageOptions: PageOption[] = [{ name: 'Prix&Contacte', path: '/Main5' }];

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

  const isPageActive = pageOptions.some(page => page.path === location.pathname);

  return (
    <header className="border-b border-transparent relative" style={{ background: '#F9FAFB' }}>
      {/* Top Header Section */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="ImmoXpert" className="h-10 w-full" onClick={() => navigate('/')} />
        </div>

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
                <ul className="absolute mt-1 w-40 bg-white shadow-lg rounded-lg py-1 z-50" role="listbox" aria-label="page">
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

          {/* Logo and Button on the right */}
          <div className="flex items-center space-x-4">
            <button className="text-white px-4 py-2 rounded-lg transition" style={{ background: '#7069F9' }}>
              Se connecter
            </button>
            <h1 className="text-x font-bold border-2 p-2 px-4 rounded-xl" style={{ borderColor: '#7069F9' }}>
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Pack</span>{' '}
              <span className="bg-gradient-to-r from-purple-500 to-orange-300 bg-clip-text text-transparent">Pro</span>
            </h1>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-700 focus:outline-none">
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
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50">
          <nav className="flex flex-col space-y-4 p-4">
            {/* Navigation Items */}
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`text-gray-700 hover:text-primary transition ${location.pathname === item.path ? 'font-bold text-black' : ''}`}
                onClick={toggleMobileMenu}
              >
                {item.name}
              </Link>
            ))}

            {/* Page Listbox for Mobile */}
            <div className="relative">
              <button
                onClick={toggleListbox}
                className={`flex items-center justify-between w-full text-gray-700 hover:text-primary transition ${
                  isPageActive ? 'font-bold text-black' : ''
                }`}
                aria-haspopup="listbox"
                aria-expanded={isListboxOpen}
              >
                <span>{selectedPage ? selectedPage.name : 'Pages'}</span>
                <FiChevronDown className={`transition-transform ${isListboxOpen ? 'rotate-180' : ''}`} size={16} />
              </button>

              {isListboxOpen && (
                <ul className="mt-2 ml-4 w-full bg-white py-1 z-50 space-y-2" role="listbox" aria-label="page">
                  {pageOptions.map(page => (
                    <li
                      key={page.name}
                      role="option"
                      aria-selected={selectedPage?.name === page.name}
                      onClick={() => {
                        selectPage(page);
                        toggleMobileMenu();
                      }}
                      className={`cursor-pointer transition ${selectedPage?.name === page.name ? 'font-medium' : ''}`}
                    >
                      {page.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Mobile Buttons */}
            <div className="flex flex-col space-y-3 mt-4">
              <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center space-x-2 justify-center">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.5996 19.25H4.34961C1.72461 19.25 1.72461 18.0687 1.72461 16.625V15.75C1.72461 15.2687 2.11836 14.875 2.59961 14.875H18.3496C18.8309 14.875 19.2246 15.2687 19.2246 15.75V16.625C19.2246 18.0687 19.2246 19.25 16.5996 19.25Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.1301 11.375V14.875H2.86133V11.375C2.86133 8.015 5.23258 5.20625 8.39133 4.5325C8.86383 4.4275 9.35383 4.375 9.86133 4.375H11.1301C11.6376 4.375 12.1363 4.4275 12.6088 4.5325C15.7676 5.215 18.1301 8.015 18.1301 11.375Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.6875 3.9375C12.6875 4.1475 12.6612 4.34 12.6087 4.5325C12.1362 4.4275 11.6375 4.375 11.13 4.375H9.86125C9.35375 4.375 8.86375 4.4275 8.39125 4.5325C8.33875 4.34 8.3125 4.1475 8.3125 3.9375C8.3125 2.73 9.2925 1.75 10.5 1.75C11.7075 1.75 12.6875 2.73 12.6875 3.9375Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M13.125 9.625H7.875" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Pack Pro</span>
              </button>
              <button className="text-white px-4 py-2 rounded-lg transition" style={{ background: '#7069F9' }}>
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
