import React, { forwardRef, useId, useState } from 'react';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

const Input = ({
  type = 'text',
  label = '',
  placeholder = '',
  className = '',
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  icon: Icon,
  ...props
}, ref) => {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="w-full space-y-2">
      {/* Label */}
      {label && (
        <label 
          className={`block text-sm font-medium transition-colors duration-200 ${
            error ? 'text-red-400' : 'text-text'
          }`} 
          htmlFor={id}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
            error 
              ? 'text-red-400' 
              : isFocused 
              ? 'text-primary' 
              : 'text-gray-400'
          }`} />
        )}

        {/* Input Field */}
        <input
          type={inputType}
          className={`
            w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-text placeholder-gray-400
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-12' : ''}
            ${isPassword ? 'pr-12' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
              : 'border-gray-700 focus:border-primary focus:ring-primary/50'
            }
            ${isFocused ? 'bg-gray-800/50' : ''}
            ${className}
          `}
          ref={ref}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-text transition-colors duration-200"
            tabIndex={-1}
          >
            {showPassword ? (
              <FiEyeOff className="w-5 h-5" />
            ) : (
              <FiEye className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Error Icon */}
        {error && !isPassword && (
          <FiAlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
        )}
      </div>

      {/* Helper Text / Error Message */}
      {(error || helperText) && (
        <div className={`text-sm flex items-start gap-1 ${
          error ? 'text-red-400' : 'text-gray-400'
        }`}>
          {error && <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
          <span>{error || helperText}</span>
        </div>
      )}
    </div>
  );
};

export default forwardRef(Input);
