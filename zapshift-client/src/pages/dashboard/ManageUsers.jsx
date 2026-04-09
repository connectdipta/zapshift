import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axiosSecure from "../../hooks/useAxiosSecure";

const roles = ["user", "admin", "rider"];

const ManageUsers = () => {
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${encodeURIComponent(search)}`);
      return res.data || [];
    },
  });

  const handleRoleChange = async (id, role) => {
    await axiosSecure.patch(`/users/${id}/role`, { role });
    await Swal.fire({ icon: "success", title: "Role Updated", confirmButtonColor: "#caeb66" });
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="mt-2 text-gray-600">Update user role: User, Admin, Rider</p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className="px-3 py-6 text-center text-gray-500" colSpan={4}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td className="px-3 py-6 text-center text-gray-500" colSpan={4}>No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b border-gray-100">
                  <td className="px-3 py-2">{user.name || "User"}</td>
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2"><span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold">{user.role || "user"}</span></td>
                  <td className="px-3 py-2">
                    <select
                      value={user.role || "user"}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="rounded-md border border-gray-300 px-2 py-1"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
