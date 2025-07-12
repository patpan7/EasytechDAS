import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.authorities && decodedToken.authorities.length > 0 ? decodedToken.authorities[0] : '';
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  const linkClasses = "px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors";
  const activeLinkClasses = "bg-gray-900 text-white";

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-start">
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/dashboard" className="text-white text-xl font-bold">Fullstack App</NavLink>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <NavLink to="/customers" className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>Customers</NavLink>
                <NavLink to="/devices" className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>Devices</NavLink>
                {userRole === 'ROLE_SUPERVISOR' && (
                  <NavLink to="/users" className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>Users</NavLink>
                )}
                <NavLink to="/change-password" className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>Change Password</NavLink>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              onClick={handleLogout}
              className="hidden sm:block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Logout
            </button>
          </div>
          <div className="-mr-2 flex sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/customers" className={({ isActive }) => `block ${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Customers</NavLink>
            <NavLink to="/devices" className={({ isActive }) => `block ${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Devices</NavLink>
            {userRole === 'ROLE_SUPERVISOR' && (
              <NavLink to="/users" className={({ isActive }) => `block ${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Users</NavLink>
            )}
            <NavLink to="/change-password" className={({ isActive }) => `block ${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Change Password</NavLink>
            <button
              onClick={handleLogout}
              className="block w-full text-left bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out mt-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
