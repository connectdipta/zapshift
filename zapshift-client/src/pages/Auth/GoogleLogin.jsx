import React, { useState } from "react";
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
  const location = useLocation();
  const navigate = useNavigate();
  const [authErrorMessage, setAuthErrorMessage] = useState("");

  const handleGoogleLogin = async () => {
    const redirectTarget = location?.state || '/';
    setAuthErrorMessage("");

    try {
      localStorage.setItem('zapshift_post_login_redirect', JSON.stringify(redirectTarget));
      await signInGoogle();
      await waitForAccessToken();
      localStorage.removeItem('zapshift_post_login_redirect');
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      if (error?.code === 'auth/popup-blocked') {
        setAuthErrorMessage('Popup was blocked by your browser. Please allow popups for this site and try again.');
        return;
      }

      if (error?.code === 'auth/popup-closed-by-user') {
        setAuthErrorMessage('Google sign-in popup was closed before completion. Please try again.');
        return;
      }

      if (error?.code === 'auth/cancelled-popup-request') {
        return;
      }

      console.error("Google login error:", error);
      setAuthErrorMessage('Google login failed. Please try again in a moment.');
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-[#EAECEF] hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-800 font-semibold py-3 rounded-lg 
                   flex items-center justify-center gap-2 transition duration-200"
      >
        <FcGoogle className="w-5 h-5" />
        {loading ? 'Signing in...' : label}
      </button>
      {authErrorMessage && (
        <p className="text-xs text-red-500 text-left">{authErrorMessage}</p>
      )}
    </div>
  );
};

export default GoogleLogin;
