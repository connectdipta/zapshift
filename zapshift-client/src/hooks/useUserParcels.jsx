import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import axiosSecure from "./useAxiosSecure";

const normalizeStatus = (status) => {
  const value = (status || "pending").toString().toLowerCase();
  if (value === "ready-to-pickup") return "ready-to-pickup";
  if (value === "ready-for-delivery") return "ready-for-delivery";
  if (value === "reached-service-center") return "reached-service-center";
  if (value === "in-transit") return "in-transit";
  if (value === "shipped") return "shipped";
  if (value === "delivered") return "delivered";
  if (value.includes("wait")) return "waiting";
  if (value.includes("process")) return "processing";
  return "pending";
};

const useUserParcels = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${encodeURIComponent(user.email)}`);
      return res.data || [];
    },
    staleTime: 60 * 1000,
  });

  const parcels = useMemo(() => {
    return (query.data || []).map((parcel) => ({
      ...parcel,
      normalizedStatus: normalizeStatus(parcel.status),
      paymentStatus: (parcel.paymentStatus || "unpaid").toLowerCase(),
      amount: Number(parcel.amount) || 0,
      parcelWeight: Number(parcel.parcelWeight) || 0,
      createdAt: parcel.createdAt ? new Date(parcel.createdAt) : new Date(),
      paidAt: parcel.paidAt ? new Date(parcel.paidAt) : null,
    }));
  }, [query.data]);

  return {
    ...query,
    parcels,
  };
};

export default useUserParcels;
