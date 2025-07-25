import React, { useState } from "react";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogOut from "./LogOut";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { FiSearch, FiUser, FiMenu } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";

const Header = ({ setSlide, slide }) => {
  const authStatus = useSelector((state) => state.auth.status);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const navItem = [
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-gray-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSlide && setSlide(!slide)}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 lg:hidden"
            >
              <FiMenu className="w-5 h-5 text-text" />
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-28 sm:w-32 transition-transform hover:scale-105">
                <Logo />
              </div>
            </Link>
          </div>

          {/* Center Section - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-l-full 
                           text-text placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-primary/50 focus:border-primary transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gray-800/80 border border-l-0 border-gray-700 
                         rounded-r-full hover:bg-gray-700/80 transition-colors duration-200
                         flex items-center justify-center"
              >
                <FiSearch className="w-5 h-5 text-text" />
              </button>
            </form>
          </div>

          {/* Right Section - Navigation */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 md:hidden">
              <FiSearch className="w-5 h-5 text-text" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-2">
              {authStatus && (
                <button className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                  <IoMdNotificationsOutline className="w-6 h-6 text-text" />
                </button>
              )}

              {navItem.map((item) =>
                item.active ? (
                  <button
                    key={item.name}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent 
                             text-white font-medium hover:shadow-lg hover:scale-105 
                             transition-all duration-200"
                    onClick={() => navigate(item.slug)}
                  >
                    {item.name}
                  </button>
                ) : null
              )}

              {authStatus && (
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                    <FiUser className="w-5 h-5 text-text" />
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 
                                   text-white font-medium transition-colors duration-200">
                    <LogOut />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 sm:hidden"
            >
              {isMobileMenuOpen ? (
                <RxCross2 className="w-5 h-5 text-text" />
              ) : (
                <GiHamburgerMenu className="w-5 h-5 text-text" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-800/50 py-4 animate-slide-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="flex-1 px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-l-lg 
                         text-text placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-primary/50 focus:border-primary"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-gray-800/80 border border-l-0 border-gray-700 
                         rounded-r-lg hover:bg-gray-700/80 transition-colors duration-200"
              >
                <FiSearch className="w-5 h-5 text-text" />
              </button>
            </form>

            {/* Mobile Navigation Items */}
            <div className="space-y-2">
              {navItem.map((item) =>
                item.active ? (
                  <button
                    key={item.name}
                    className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-accent 
                             text-white font-medium text-left"
                    onClick={() => {
                      navigate(item.slug);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </button>
                ) : null
              )}

              {authStatus && (
                <button className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 
                                 text-white font-medium text-left transition-colors duration-200">
                  <LogOut />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
