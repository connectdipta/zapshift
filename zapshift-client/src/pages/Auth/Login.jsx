import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from 'react-router';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';
import GoogleLogin from './GoogleLogin';
import Swal from 'sweetalert2';

const waitForAccessToken = async (maxWaitMs = 8000, intervalMs = 200) => {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const token = localStorage.getItem("zapshift_access_token");
    if (token) return true;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
};

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const { user, signInUser, resetPassword, loading } = useAuth();
  const [resetMessage, setResetMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  useEffect(() => {
    if (!user) return;

    let isCancelled = false;

    const finalizeRedirect = async () => {
      const redirectTarget = JSON.parse(localStorage.getItem('zapshift_post_login_redirect') || 'null');
      localStorage.removeItem('zapshift_post_login_redirect');

      await waitForAccessToken();
      if (!isCancelled) {
        navigate(redirectTarget || location?.state || '/', { replace: true });
      }
    };

    finalizeRedirect();
    return () => {
      isCancelled = true;
    };
  }, [location?.state, navigate, user]);

  const onSubmit = async (data) => {
    try {
      await signInUser(data.email, data.password)
      await waitForAccessToken();
      navigate(location?.state || '/', { replace: true })
    } catch (error) {
      console.log(error);
      let message = "An error occurred during login. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = "Account not found or invalid credentials.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many failed attempts. Please try again later.";
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: '#fff',
        color: '#103d45',
        iconColor: '#ef4444',
      });
    }
  };

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = async () => {
    const email = getValues('email')?.trim();
    setResetMessage('');

    if (!email) {
      setResetMessage('Enter your email first, then click forgot password.');
      return;
    }

    try {
      setIsResetting(true);
      await resetPassword(email);
      setResetMessage('Password reset email sent. Please check your inbox.');
    } catch {
      setResetMessage('Could not send reset email. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      {/* Header Section */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 text-black">Welcome Back</h2>
      <p className="text-sm sm:text-base text-gray-800 mb-6 sm:mb-8">Login with ZapShift</p>

      {/* Login Form */}
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Email Field */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
          <input 
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-[#CBEF43] focus:border-transparent transition"
          />
          
          {errors.email?.type === "required" && (
            <p className="text-red-500 text-sm mt-1">Email is required</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: true, minLength: 6 })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-[#CBEF43] focus:border-transparent transition"
            />

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
            >
              {showPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>

          {errors.password?.type === "required" && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
        </div>

        {/* Forget Password */}
        <div className="flex justify-start">
          <button type="button" onClick={handleForgotPassword} disabled={isResetting} className="text-gray-500 disabled:text-gray-400 text-sm font-medium underline hover:text-gray-700">
            Forget Password?
          </button>
        </div>
        {resetMessage && <p className="text-xs text-gray-600 -mt-3">{resetMessage}</p>}

        {/* Login Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#D0EF5B] hover:bg-[#bfe04a] disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition duration-200"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Register Link */}
      <p className="mt-4 text-gray-500 text-sm leading-6">
        Don't have any account?  
        <Link state={location.state} to="/register" className="text-[#8FB02D] font-bold hover:underline"> Register</Link>
      </p>

      {/* Or Divider */}
      <div className="relative flex py-6 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 text-gray-400 text-sm">Or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Google Login Button */}
     <GoogleLogin label="Login with Google" />
    </div>
  );
};

export default Login;
