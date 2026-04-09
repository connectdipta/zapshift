import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import axiosSecure from "./useAxiosSecure";

const useCurrentUserRole = () => {
  const { user } = useAuth();
  const accessToken = localStorage.getItem("zapshift_access_token");

  const query = useQuery({
    queryKey: ["current-user-role", user?.email],
    enabled: !!user?.email && !!accessToken,
    retry: 1,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/me?email=${encodeURIComponent(user.email)}`);
      return res.data;
    },
  });

  const role = (query.data?.role || "user").toLowerCase();
  const riderStatus = (query.data?.riderStatus || "none").toLowerCase();

  return {
    ...query,
    role,
    riderStatus,
    isAdmin: role === "admin",
    isRider: role === "rider",
    isRiderPending: riderStatus === "pending",
    isRiderApproved: riderStatus === "approved",
    isRiderRejected: riderStatus === "rejected",
  };
};

export default useCurrentUserRole;
