// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Briefcase, LogOut, User, Home, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout, isStudent, isStartup } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
            onClick={closeMobileMenu}
          >
            <div className="w-11 h-11 bg-linear-to-br rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ">
              {/* <Briefcase className="w-5 h-5 text-white" /> */}
              <img 
                src="/graduation-cap-svgrepo-com.svg" 
                alt="Internship Portal Logo" 
                className="w-6 h-6"
              />
              {/* Add Logo as svg in public folder :- graduation-mortarboard-svgrepo-com.svg */}
              
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Intern-Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link 
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {isStudent && (
                  <Link 
                    to="/internships"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                  >
                    <Briefcase className="w-4 h-4" />
                    Browse Internships
                  </Link>
                )}

                {isStartup && (
                  <Link 
                    to="/my-internships"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                  >
                    <Briefcase className="w-4 h-4" />
                    My Internships
                  </Link>
                )}

                <Link 
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                {/* User Info Dropdown */}
                <div className="ml-2 pl-4 border-l border-gray-200 flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.user_type}
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            {user ? (
              <div className="flex flex-col gap-2">
                {/* User Info */}
                <div className="px-4 py-3 mb-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="text-sm font-medium text-gray-900">
                    {user.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 capitalize mt-1">
                    {user.user_type}
                  </div>
                </div>

                <Link 
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>

                {isStudent && (
                  <Link 
                    to="/internships"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                  >
                    <Briefcase className="w-5 h-5" />
                    Browse Internships
                  </Link>
                )}

                {isStartup && (
                  <Link 
                    to="/my-internships"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                  >
                    <Briefcase className="w-5 h-5" />
                    My Internships
                  </Link>
                )}

                <Link 
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>

                <button 
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 font-medium w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link 
                  to="/login"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-center"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all duration-200 font-medium text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;