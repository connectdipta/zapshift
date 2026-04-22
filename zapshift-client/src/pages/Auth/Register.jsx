import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';
import GoogleLogin from './GoogleLogin';
import axios from 'axios';
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

const Register = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const { user, registerUser, updateUserProfile, loading } = useAuth();
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
     // Upload image
    const formData = new FormData();
    formData.append("image", data.photo[0]);

    const imageAPI = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgHost}`;
    const response = await axios.post(imageAPI, formData);
    const imageUrl = response.data.data.url;

    // Create Firebase user
    const result = await registerUser(data.email, data.password);
    console.log("User created:", result.user);

    // Update profile
    await updateUserProfile({
      displayName: data.name,
      photoURL: imageUrl,
    });

    navigate(location?.state || '/');

    console.log("Profile updated!");
  } catch (error) {
    console.error("Registration error:", error);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: error.message || 'Registration failed. Please try again.',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
    });
  }
};

  const [showPassword, setShowPassword] = useState(false);
  const photoFile = watch("photo");

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 text-black">Create an Account</h2>
      <p className="text-sm sm:text-base text-gray-800 mb-6 sm:mb-8">Register with ZapShift</p>

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Profile Photo</label>
          {/* Preview */}
          {photoFile && photoFile.length > 0 && (
            <img
              src={URL.createObjectURL(photoFile[0])}
              alt="Preview"
              className="mt-3 w-24 h-24 object-cover rounded-full border mb-3"
            />
          )}
          <input
            type="file"
            accept="image/*"
            {...register("photo", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 
              focus:outline-none focus:ring-2 focus:ring-[#CBEF43] transition"
          />
          {errors.photo && <p className="text-red-500 text-sm mt-1">Photo is required</p>}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-[#CBEF43] transition"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-[#CBEF43] transition"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: true, minLength: 6 })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-[#CBEF43] transition"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password?.type === "required" && <p className="text-red-500 text-sm mt-1">Password is required</p>}
          {errors.password?.type === "minLength" && <p className="text-red-500 text-sm mt-1">Minimum 6 characters</p>}
        </div>

        

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#CBEF43] hover:bg-[#b9dc3d] disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {/* Already have account */}
      <p className="mt-4 text-gray-500 text-sm leading-6">
        Already have an account?
        <Link state = {location.state} to="/login" className="text-[#8FB02D] font-bold ml-1 hover:underline">
          Login
        </Link>
      </p>

      {/* Divider */}
      <div className="relative flex py-6 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 text-gray-400 text-sm">Or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Google Button */}
      <GoogleLogin label="Register with Google" />
    </div>
  );
};

export default Register;
