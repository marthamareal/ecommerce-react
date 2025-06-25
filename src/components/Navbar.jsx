import React, { useState, useRef, useEffect } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // desktop dropdown
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false); // mobile dropdown

  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileDropdown = () => setIsMobileDropdownOpen(!isMobileDropdownOpen);

  let token = localStorage.getItem("token");
  if (token === "undefined" || token === "null") {
    token = null;
  }
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setIsMobileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md relative sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Ecommerce Project
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-indigo-600">Products</Link>
            {token && (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-indigo-600">Cart</Link>
                <Link to="/orders" className="text-gray-700 hover:text-indigo-600">Orders</Link>
              </>
            )}
            {/* Auth Links */}
            {!token && (
              <>
                <Link to="/register" className="text-gray-700 hover:text-indigo-600">Register</Link>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
              </>
            )}

            {/* Avatar Dropdown with Icon */}
            {token && (
              <>
                <div className="relative" ref={desktopDropdownRef}>
                  <button onClick={toggleDropdown} className="focus:outline-none">
                    <UserCircleIcon className="w-10 h-10 text-indigo-500 hover:text-indigo-700" />
                  </button>

                  <div
                    className={`absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50
                  transform transition-all duration-200 origin-top-right
                  ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                  >
                    <ul>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                      <li onClick={handleLogout} role="button" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden transition-max-height duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
          >
            Products
          </Link>
          {token && (
            <>
              <Link
                to="/cart"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              >
                Cart
              </Link>
              <Link
                to="/orders"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              >
                Orders
              </Link>
            </>
          )}
          {/* Auth Links */}
          {!token && (
            <>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              >
                Login
              </Link>
            </>
          )}

          {/* Mobile Avatar Dropdown with Icon */}
          {token && (
            <>
              <div className="px-3 py-2 border-t border-gray-200" ref={mobileDropdownRef}>
                <button
                  onClick={toggleMobileDropdown}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <UserCircleIcon className="w-10 h-10 text-indigo-500 hover:text-indigo-700" />
                </button>

                <div
                  className={`mt-2 bg-white rounded-md shadow text-black
                transform transition-all duration-200 origin-top-left
                ${isMobileDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                >
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                    <li onClick={handleLogout} role="button" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>

                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
