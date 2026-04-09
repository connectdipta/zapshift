import React from "react";
import { Navigate, useLocation } from "react-router";
import LottieAnimation from "../components/LottieAnimation";
import loadingAnimation from "../assets/animations/loading.json";
import useAuth from "../hooks/useAuth";
import useCurrentUserRole from "../hooks/useCurrentUserRole";

const RiderRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const { isRider, isLoading } = useCurrentUserRole();

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LottieAnimation animationData={loadingAnimation} className="h-24 w-24" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={location.pathname} />;
  }

  if (!isRider) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RiderRoute;
