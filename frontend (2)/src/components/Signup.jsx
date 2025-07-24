import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from './index';
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth";
import { useDispatch } from "react-redux";
import { login as authLogin } from '../store/authSlice';
import Input from "./Inputs";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiImage, FiUserPlus, FiArrowRight, FiUpload } from "react-icons/fi";

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const watchedAvatar = watch("avatar");
  const watchedCover = watch("coverImage");

  const signup = async (data) => {
    const newData = {
      avatar: data.avatar[0],
      coverImage: data.coverImage[0],
      fullname: data?.fullname,
      userName: data?.userName,
      email: data?.email,
      password: data.password,
    };
    
    try {
      setPending(true);
      const createSession = await authService.createAccount(newData);
      if (createSession) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin(userData.data));
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl">
        <div className="glass rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[700px]">
            {/* Left Side - Image/Illustration */}
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-accent/10 to-primary/10 p-12">
              <div className="text-center space-y-6">
                <div className="w-64 h-64 mx-auto">
                  <img 
                    src="/images/signup.svg" 
                    alt="Signup illustration" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold gradient-text">Join Our Community!</h2>
                  <p className="text-gray-300 text-lg">
                    Create your account and start sharing amazing content
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="flex items-center justify-center p-8 lg:p-12">
              <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-accent/20 rounded-full">
                      <FiUserPlus className="w-8 h-8 text-accent" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-text">Create Account</h1>
                  <p className="text-gray-400">Fill in your details to get started</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(signup)} className="space-y-6">
                  {/* File Upload Section */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Avatar Upload */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-text">
                        <FiUser className="w-4 h-4" />
                        Avatar
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg 
                                   text-text text-xs file:mr-2 file:py-1 file:px-2 file:rounded 
                                   file:border-0 file:bg-primary file:text-white file:text-xs
                                   hover:file:bg-primary/80 focus:outline-none focus:ring-2 
                                   focus:ring-primary/50 transition-all duration-200"
                          {...register("avatar", { required: "Avatar is required" })}
                        />
                        {watchedAvatar && watchedAvatar[0] && (
                          <div className="mt-1 text-xs text-green-400 flex items-center gap-1">
                            <FiImage className="w-3 h-3" />
                            Selected
                          </div>
                        )}
                      </div>
                      {errors.avatar && (
                        <p className="text-red-400 text-xs">{errors.avatar.message}</p>
                      )}
                    </div>

                    {/* Cover Image Upload */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-text">
                        <FiImage className="w-4 h-4" />
                        Cover
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg 
                                   text-text text-xs file:mr-2 file:py-1 file:px-2 file:rounded 
                                   file:border-0 file:bg-accent file:text-white file:text-xs
                                   hover:file:bg-accent/80 focus:outline-none focus:ring-2 
                                   focus:ring-accent/50 transition-all duration-200"
                          {...register("coverImage", { required: "Cover image is required" })}
                        />
                        {watchedCover && watchedCover[0] && (
                          <div className="mt-1 text-xs text-green-400 flex items-center gap-1">
                            <FiImage className="w-3 h-3" />
                            Selected
                          </div>
                        )}
                      </div>
                      {errors.coverImage && (
                        <p className="text-red-400 text-xs">{errors.coverImage.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-text">
                      <FiUser className="w-4 h-4" />
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className={`input pl-12 ${errors.fullname ? 'border-red-500 focus:ring-red-500' : ''}`}
                        {...register("fullname", {
                          required: "Full name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters"
                          }
                        })}
                      />
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.fullname && (
                      <p className="text-red-400 text-sm">{errors.fullname.message}</p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-text">
                      <FiUser className="w-4 h-4" />
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Choose a username"
                        className={`input pl-12 ${errors.userName ? 'border-red-500 focus:ring-red-500' : ''}`}
                        {...register("userName", {
                          required: "Username is required",
                          minLength: {
                            value: 3,
                            message: "Username must be at least 3 characters"
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message: "Username can only contain letters, numbers, and underscores"
                          }
                        })}
                      />
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.userName && (
                      <p className="text-red-400 text-sm">{errors.userName.message}</p>
                    )}
                  </div>

                  {/* Email */}
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

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-text">
                      <FiLock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
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

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    loading={pending}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {pending ? "Creating Account..." : (
                      <>
                        Create Account
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

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-gray-400">
                      Already have an account?{" "}
                      <Link 
                        to="/login" 
                        className="text-accent hover:text-primary font-medium transition-colors"
                      >
                        Sign in here
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

export default Signup;
