import React from "react";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";

const waitForAccessToken = async (maxWaitMs = 8000, intervalMs = 200) => {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const token = localStorage.getItem("zapshift_access_token");
    if (token) return true;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
};

const GoogleLogin = ({ label = "Login with Google" }) => {
  const { signInGoogle, loading } = useAuth();
  const location = useLocation()
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    signInGoogle()
      .then(async () => {
        await waitForAccessToken();
        navigate(location?.state || '/')
      })
      .catch((error) => {
        console.error("Google login error:", error);
      });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full bg-[#EAECEF] hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-800 font-semibold py-3 rounded-lg 
                 flex items-center justify-center gap-2 transition duration-200"
    >
      <FcGoogle className="w-5 h-5" />
      {loading ? 'Signing in...' : label}
    </button>
  );
};

export default GoogleLogin;
