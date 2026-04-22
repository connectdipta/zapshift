import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axiosSecure from "../../hooks/useAxiosSecure";
import { MdOutlineManageAccounts, MdSearch, MdOutlineShield, MdPersonOutline } from "react-icons/md";

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
    try {
      await axiosSecure.patch(`/users/${id}/role`, { role });
      await Swal.fire({ icon: "success", title: "Role Updated", text: `User promoted to ${role} successfully.`, confirmButtonColor: "#b8d94a" });
      refetch();
    } catch (e) {
      await Swal.fire({ icon: "error", title: "Update Failed", text: e.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Manage Users</h1>
          <p className="mt-1 text-sm text-gray-500">Search and update user permissions system-wide.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
           <MdOutlineManageAccounts className="text-gray-400 text-xl" />
           <span className="text-lg font-black text-[#103d45]">{users.length}</span>
        </div>
      </div>

      <div className="relative group">
        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-[#b8d94a] transition-colors" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email address..."
          className="w-full rounded-2xl border border-gray-100 bg-white px-12 py-4 text-sm shadow-sm outline-none transition focus:border-[#b8d94a] focus:ring-4 focus:ring-lime-50"
        />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Current Role</th>
              <th className="px-6 py-4 text-right">Change Permissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td className="py-20 text-center text-gray-400 text-sm" colSpan={3}>Fetching directory...</td></tr>
            ) : users.length === 0 ? (
              <tr><td className="py-20 text-center text-gray-400 text-sm" colSpan={3}>No users found matching your search.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="group hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#103d45]">{user.name || "Anonymous User"}</p>
                    <p className="text-[10px] font-medium text-gray-400">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                      <select
                        value={user.role || "user"}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-[#103d45] outline-none transition focus:border-[#b8d94a] cursor-pointer"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>{role.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {users.map((user) => (
          <div key={user._id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                 <MdPersonOutline className="text-xl" />
               </div>
               <div className="min-w-0">
                 <h3 className="truncate text-base font-extrabold text-[#103d45]">{user.name || "Anonymous"}</h3>
                 <p className="truncate text-[10px] font-medium text-gray-400">{user.email}</p>
               </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-4">
              <div className="flex items-center gap-2">
                 <MdOutlineShield className="text-gray-300" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Role</span>
              </div>
              <select
                value={user.role || "user"}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-black text-[#103d45] outline-none"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{role.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
