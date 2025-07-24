import React from "react";

const Loader = ({ size = "md", text = "Loading...", fullScreen = true }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const LoaderSpinner = () => (
    <div className="relative">
      {/* Outer ring */}
      <div className={`${sizes[size]} border-4 border-gray-700 rounded-full animate-spin`}>
        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>
      
      {/* Inner ring */}
      <div className={`absolute inset-2 border-2 border-gray-600 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
        <div className="absolute inset-0 border-2 border-transparent border-t-accent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <LoaderSpinner />
          {text && (
            <div className="text-text text-lg font-medium animate-pulse">
              {text}
            </div>
          )}
          
          {/* Animated dots */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-2">
        <LoaderSpinner />
        {text && (
          <div className="text-text text-sm font-medium animate-pulse">
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;
