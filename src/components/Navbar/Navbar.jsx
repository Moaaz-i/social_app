import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppName } from "./../../config";

const Navbar = ({ hide }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const navItems = [
    { path: "/", label: "Home", icon: "🏠", show: true },
    {
      path: "/posts",
      label: "Posts",
      icon: "📝",
      show: true,
    },
  ];

  return (
    <div className={`sticky top-0 z-50 ${hide ? "hidden" : ""}`}>
      <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="container px-5 mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg uppercase">
                  {AppName[0]}
                </span>
              </div>
              <span className="font-bold text-xl">{AppName}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              {navItems
                .filter((item) => item.show)
                .map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle (placeholder) */}
              <button
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Toggle theme"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </button>

              {/* Mobile Menu Button */}
              <div className="dropdown md:hidden">
                <button
                  className="btn btn-ghost"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        isMenuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h8m-8 6h16"
                      }
                    />
                  </svg>
                </button>
                {isMenuOpen && (
                  <ul className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-white rounded-box w-52">
                    {navItems
                      .filter((item) => item.show)
                      .map((item) => (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className={`flex items-center gap-2 ${
                              isActive(item.path)
                                ? "bg-blue-100 text-blue-700"
                                : ""
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span>{item.icon}</span>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
