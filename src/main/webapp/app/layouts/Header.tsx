import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../content/assets/logo.png';

interface NavItem {
  name: string;
  path: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { name: 'Acheter', path: '/acheter' },
    { name: 'Louer', path: '/louer' },
    { name: 'Estimation', path: '/estimation' },
    { name: 'Investisseurs', path: '/investisseurs' },
    { name: 'Prix immobiliers', path: '/PrixImmobliers' },
    { name: 'Trouver un agent', path: '/TrouverAgent' },
  ];

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="ImmoXpert" className="h-8 md:h-10 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`text-gray-700 hover:text-black transition ${location.pathname === item.path ? 'font-semibold text-black' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <button className="px-4 py-2 border border-[#7069F9] rounded-lg text-[#7069F9] font-medium hover:bg-[#f0f0ff] transition">
            Se connecter
          </button>
          <button className="px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#1E1E9C' }}>
            S’inscrire
          </button>
          <button className="px-4 py-2 rounded-lg font-medium text-[#FF6F61] border border-[#FF6F61] bg-white">Pack Pro</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
