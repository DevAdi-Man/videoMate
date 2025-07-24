import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import Input from "./Inputs";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight } from "react-icons/fi";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (data) => {
    setIsLoading(true);
    try {
      const LoginSession = await authService.Login(data);
      if (LoginSession) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin(userData.data));
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl">
        <div className="glass rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left Side - Image/Illustration */}
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 p-12">
              <div className="text-center space-y-6">
                <div className="w-64 h-64 mx-auto">
                  <img 
                    src="/images/login.svg" 
                    alt="Login illustration" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold gradient-text">Welcome Back!</h2>
                  <p className="text-gray-300 text-lg">
                    Sign in to continue your journey with us
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center p-8 lg:p-12">
              <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-primary/20 rounded-full">
                      <FiUser className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-text">Sign In</h1>
                  <p className="text-gray-400">Enter your credentials to access your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(login)} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-text">
                      <FiMail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className={`input pl-12 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                            message: "Please enter a valid email address"
                          }
                        })}
                      />
                      <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-text">
                      <FiLock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`input pl-12 pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                          }
                        })}
                      />
                      <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-text transition-colors"
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:text-accent transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    loading={isLoading}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Signing In..." : (
                      <>
                        Sign In
                        <FiArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-gray-400">or</span>
                    </div>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className="text-gray-400">
                      Don't have an account?{" "}
                      <Link 
                        to="/signup" 
                        className="text-primary hover:text-accent font-medium transition-colors"
                      >
                        Create one now
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
