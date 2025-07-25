import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  FiHome, 
  FiHeart, 
  FiClock, 
  FiVideo, 
  FiUsers, 
  FiTrendingUp,
  FiMusic,
  FiMonitor,
  FiSettings,
  FiHelpCircle,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

const MiniDrawer = ({ children }) => {
  const authStatus = useSelector((state) => state.auth.status);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    {
      name: "Home",
      icon: FiHome,
      slug: "/",
      active: true,
      category: "main"
    },
    {
      name: "Trending",
      icon: FiTrendingUp,
      slug: "/trending",
      active: true,
      category: "main"
    },
    {
      name: "Music",
      icon: FiMusic,
      slug: "/music",
      active: true,
      category: "main"
    },
    {
      name: "Gaming",
      icon: FiMonitor,
      slug: "/gaming",
      active: true,
      category: "main"
    },
    {
      name: "Liked Videos",
      icon: FiHeart,
      slug: "/liked-videos",
      active: authStatus,
      category: "library"
    },
    {
      name: "History",
      icon: FiClock,
      slug: "/history",
      active: authStatus,
      category: "library"
    },
    {
      name: "My Content",
      icon: FiVideo,
      slug: "/content",
      active: authStatus,
      category: "library"
    },
    {
      name: "Subscribers",
      icon: FiUsers,
      slug: "/subscribers",
      active: authStatus,
      category: "library"
    },
    {
      name: "Settings",
      icon: FiSettings,
      slug: "/settings",
      active: authStatus,
      category: "other"
    },
    {
      name: "Help",
      icon: FiHelpCircle,
      slug: "/help",
      active: true,
      category: "other"
    }
  ];

  const mainItems = sidebarItems.filter(item => item.category === "main" && item.active);
  const libraryItems = sidebarItems.filter(item => item.category === "library" && item.active);
  const otherItems = sidebarItems.filter(item => item.category === "other" && item.active);

  const SidebarItem = ({ item }) => {
    const isActive = location.pathname === item.slug;
    const Icon = item.icon;

    return (
      <Link
        to={item.slug}
        className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group
                   ${isActive 
                     ? 'bg-primary/20 text-primary border-r-2 border-primary' 
                     : 'text-gray-300 hover:bg-gray-800/50 hover:text-text'
                   }`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-text'}`} />
        <span className={`font-medium transition-all duration-200 ${
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 lg:opacity-100 lg:translate-x-0'
        }`}>
          {item.name}
        </span>
      </Link>
    );
  };

  const SidebarSection = ({ title, items }) => (
    <div className="space-y-1">
      {title && (
        <h3 className={`px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider
                       ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
          {title}
        </h3>
      )}
      {items.map((item) => (
        <SidebarItem key={item.name} item={item} />
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-900/95 backdrop-blur-md 
                        border-r border-gray-800/50 transition-all duration-300 z-40
                        ${isOpen ? 'w-64' : 'w-16 lg:w-64'}`}>
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-6 bg-gray-800 hover:bg-gray-700 rounded-full p-1.5 
                   border border-gray-700 transition-colors duration-200 lg:hidden"
        >
          {isOpen ? (
            <FiChevronLeft className="w-4 h-4 text-text" />
          ) : (
            <FiChevronRight className="w-4 h-4 text-text" />
          )}
        </button>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full py-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Main Navigation */}
            <SidebarSection items={mainItems} />

            {/* Library Section */}
            {libraryItems.length > 0 && (
              <>
                <div className="border-t border-gray-800/50 mx-4"></div>
                <SidebarSection title="Library" items={libraryItems} />
              </>
            )}

            {/* Other Section */}
            {otherItems.length > 0 && (
              <>
                <div className="border-t border-gray-800/50 mx-4"></div>
                <SidebarSection items={otherItems} />
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto px-4 py-4 border-t border-gray-800/50">
            <div className={`text-xs text-gray-500 transition-all duration-200 ${
              isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'
            }`}>
              <p>&copy; 2024 YouTube Clone</p>
              <p className="mt-1">Made with ❤️</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${
        isOpen ? 'ml-16 lg:ml-64' : 'ml-16 lg:ml-64'
      }`}>
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MiniDrawer;
