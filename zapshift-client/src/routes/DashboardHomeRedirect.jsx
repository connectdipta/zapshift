import React from "react";
import { Navigate } from "react-router";
import useCurrentUserRole from "../hooks/useCurrentUserRole";

const DashboardHomeRedirect = () => {
  const { role, isLoading } = useCurrentUserRole();

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-6 text-sm text-gray-500 shadow-sm">Loading dashboard...</div>;
  }

  if (role === "admin") return <Navigate to="/dashboard/admin" replace />;
  if (role === "rider") return <Navigate to="/dashboard/rider" replace />;
  return <Navigate to="/dashboard/user" replace />;
};

export default DashboardHomeRedirect;
