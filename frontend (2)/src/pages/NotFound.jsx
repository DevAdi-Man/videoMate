import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiArrowLeft, 
  FiSearch, 
  FiVideo,
  FiTrendingUp,
  FiRefreshCw,
  FiWifi,
  FiAlertTriangle
} from "react-icons/fi";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [isAutoRedirect, setIsAutoRedirect] = useState(true);

  // Auto redirect countdown
  useEffect(() => {
    if (isAutoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isAutoRedirect && countdown === 0) {
      navigate('/');
    }
  }, [countdown, isAutoRedirect, navigate]);

  const handleGoHome = () => {
    setIsAutoRedirect(false);
    navigate('/');
  };

  const handleGoBack = () => {
    setIsAutoRedirect(false);
    navigate(-1);
  };

  const quickLinks = [
    {
      name: "Home",
      path: "/",
      icon: FiHome,
      description: "Go back to homepage"
    },
    {
      name: "Trending",
      path: "/trending",
      icon: FiTrendingUp,
      description: "Check what's trending"
    },
    {
      name: "My Content",
      path: "/content",
      icon: FiVideo,
      description: "View your videos"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="mb-8 relative">
          <div className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-bold text-primary/20 blur-sm">
            404
          </div>
        </div>

        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center animate-bounce">
            <FiAlertTriangle className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-4 animate-fade-in">
          Oops! Page Not Found
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          The page you're looking for seems to have vanished into the digital void. 
          Don't worry, even the best explorers sometimes take a wrong turn!
        </p>

        {/* Auto Redirect Counter */}
        {isAutoRedirect && (
          <div className="mb-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800/50 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-300 mb-2">
              Automatically redirecting to home in
            </p>
            <div className="text-2xl font-bold text-primary">
              {countdown} seconds
            </div>
            <button
              onClick={() => setIsAutoRedirect(false)}
              className="mt-2 text-sm text-gray-400 hover:text-text transition-colors duration-200"
            >
              Cancel auto-redirect
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={handleGoHome}
            className="btn-primary flex items-center justify-center gap-3 px-8 py-4 text-lg font-medium hover:scale-105 transition-all duration-300"
          >
            <FiHome className="w-5 h-5" />
            Go Home
          </button>
          
          <button
            onClick={handleGoBack}
            className="btn-secondary flex items-center justify-center gap-3 px-8 py-4 text-lg font-medium hover:scale-105 transition-all duration-300"
          >
            <FiArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary flex items-center justify-center gap-3 px-8 py-4 text-lg font-medium hover:scale-105 transition-all duration-300"
          >
            <FiRefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* Quick Links */}
        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-xl font-semibold text-text mb-6">
            Or try these popular destinations:
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="group p-6 bg-gray-900/50 hover:bg-gray-800/50 rounded-xl border border-gray-800/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${1 + index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary/20 group-hover:bg-primary/30 rounded-full flex items-center justify-center mb-3 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-text mb-2 group-hover:text-primary transition-colors duration-300">
                      {link.name}
                    </h4>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {link.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <FiSearch className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold text-text">
              Looking for something specific?
            </h4>
          </div>
          <p className="text-gray-400 mb-4">
            Try using the search bar in the header to find videos, channels, or content you're looking for.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <FiWifi className="w-4 h-4" />
            <span>Make sure you're connected to the internet</span>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-8 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '1.4s' }}>
          <p>
            "Not all who wander are lost, but this page definitely is." 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
