import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiInfo, FiAlertTriangle, FiHeart, FiShare2, FiDownload } from 'react-icons/fi';

const Toast = ({ message, type = 'success', duration = 3000, onClose, icon }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'success':
        return <FiCheck className="w-5 h-5" />;
      case 'error':
        return <FiX className="w-5 h-5" />;
      case 'warning':
        return <FiAlertTriangle className="w-5 h-5" />;
      case 'info':
        return <FiInfo className="w-5 h-5" />;
      case 'like':
        return <FiHeart className="w-5 h-5" />;
      case 'share':
        return <FiShare2 className="w-5 h-5" />;
      case 'download':
        return <FiDownload className="w-5 h-5" />;
      default:
        return <FiCheck className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 text-white border-green-400';
      case 'error':
        return 'bg-red-500/90 text-white border-red-400';
      case 'warning':
        return 'bg-yellow-500/90 text-white border-yellow-400';
      case 'info':
        return 'bg-blue-500/90 text-white border-blue-400';
      case 'like':
        return 'bg-gradient-to-r from-primary to-accent text-white border-primary';
      case 'share':
        return 'bg-purple-500/90 text-white border-purple-400';
      case 'download':
        return 'bg-indigo-500/90 text-white border-indigo-400';
      default:
        return 'bg-gray-800/90 text-white border-gray-600';
    }
  };

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
      isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
    }`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg ${getStyles()}`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsVisible(false);
              onClose?.();
            }, 300);
          }}
          className="flex-shrink-0 ml-2 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Manager Hook
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', options = {}) => {
    const id = Date.now();
    const toast = {
      id,
      message,
      type,
      ...options,
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, options.duration || 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          icon={toast.icon}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};

export default Toast;
