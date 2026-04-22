import React, { useState } from "react";
import { MdSettings, MdEmail, MdPerson, MdWarning, MdLock, MdNotificationsActive } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import axiosSecure from "../../../hooks/useAxiosSecure";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase.init";

const SETTINGS_STORAGE_KEY = "zapshift_user_notification_settings";

const defaultNotificationSettings = {
  parcel_updates: true,
  sms_notifications: true,
  promotional: false,
};

const UserSettings = () => {
  const { user, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [notificationSettings, setNotificationSettings] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || "null");
      return stored ? { ...defaultNotificationSettings, ...stored } : defaultNotificationSettings;
    } catch (error) {
      return defaultNotificationSettings;
    }
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile({ displayName });
      await axiosSecure.post("/users/sync", {
        email: user?.email,
        name: displayName,
        photoURL: user?.photoURL || "",
      });
      await Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully.",
        confirmButtonColor: "#b8d94a",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(notificationSettings));
    await Swal.fire({
      icon: "success",
      title: "Preferences Saved",
      text: "Your notification settings have been updated.",
      confirmButtonColor: "#b8d94a",
    });
  };

  const handleNotificationToggle = (id) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      await Swal.fire({ icon: "error", title: "No User Found", text: "Please login again.", confirmButtonColor: "#ef4444" });
      return;
    }

    if (newPassword.length < 6) {
      await Swal.fire({ icon: "warning", title: "Weak Password", text: "Must be at least 6 characters.", confirmButtonColor: "#f59e0b" });
      return;
    }

    if (newPassword !== confirmPassword) {
      await Swal.fire({ icon: "warning", title: "Password Mismatch", text: "Passwords must match.", confirmButtonColor: "#f59e0b" });
      return;
    }

    const hasPasswordProvider = auth.currentUser?.providerData?.some((provider) => provider.providerId === "password");
    if (!hasPasswordProvider) {
      await Swal.fire({ icon: "info", title: "Social Login", text: "Password change is not available for social accounts.", confirmButtonColor: "#3b82f6" });
      return;
    }

    try {
      setPasswordLoading(true);
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      await Swal.fire({ icon: "success", title: "Password Updated", text: "Changed successfully.", confirmButtonColor: "#b8d94a" });
    } catch (error) {
      await Swal.fire({ icon: "error", title: "Update Failed", text: error?.message || "Error updating password.", confirmButtonColor: "#ef4444" });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45] flex items-center gap-3">
          <MdSettings className="text-[#b8d94a]" />
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">Manage your profile, security and notifications.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-[#103d45]">
            <MdPerson className="text-xl text-gray-400" />
            Profile Details
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-11 py-3 text-sm text-gray-500 outline-none"
                />
              </div>
              <p className="mt-1.5 text-[10px] font-medium text-amber-600">Registered email cannot be changed.</p>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400">Display Name</label>
              <div className="relative">
                <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-gray-200 bg-white px-11 py-3 text-sm text-[#103d45] outline-none transition focus:border-[#b8d94a] focus:ring-4 focus:ring-lime-50"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#caeb66] px-8 py-3 text-sm font-bold text-[#1c2d1a] transition hover:brightness-95 active:scale-95 disabled:opacity-50"
              >
                <IoCheckmarkCircle className="text-lg" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Security Settings */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-[#103d45]">
            <MdLock className="text-xl text-gray-400" />
            Security & Password
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-1">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#103d45] outline-none transition focus:border-[#b8d94a] focus:ring-4 focus:ring-lime-50"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#103d45] outline-none transition focus:border-[#b8d94a] focus:ring-4 focus:ring-lime-50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#103d45] outline-none transition focus:border-[#b8d94a] focus:ring-4 focus:ring-lime-50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#103d45] px-8 py-3 text-sm font-bold text-white transition hover:brightness-125 active:scale-95 disabled:opacity-50"
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Notifications */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-[#103d45]">
            <MdNotificationsActive className="text-xl text-gray-400" />
            Notification Preferences
          </h2>

          <div className="space-y-3">
            {[
              { label: "Email for parcel updates", id: "parcel_updates" },
              { label: "SMS notifications on delivery", id: "sms_notifications" },
              { label: "Weekly promotional offers", id: "promotional" },
            ].map((item) => (
              <label key={item.id} className="group flex cursor-pointer items-center justify-between rounded-2xl border border-gray-50 p-4 transition hover:bg-gray-50">
                <span className="text-sm font-bold text-gray-600 transition group-hover:text-[#103d45]">{item.label}</span>
                <input
                  type="checkbox"
                  checked={Boolean(notificationSettings[item.id])}
                  onChange={() => handleNotificationToggle(item.id)}
                  className="h-5 w-5 rounded-lg border-gray-300 accent-[#b8d94a]"
                />
              </label>
            ))}
          </div>

          <div className="pt-6">
            <button onClick={handleSaveNotificationSettings} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#caeb66] bg-[#faffed] px-8 py-3 text-sm font-bold text-[#1c2d1a] transition hover:bg-[#caeb66] active:scale-95">
              <IoCheckmarkCircle className="text-lg" />
              Save Preferences
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-3xl border border-rose-100 bg-rose-50/50 p-6 shadow-sm sm:p-8">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-rose-800">
            <MdWarning className="text-xl" />
            Danger Zone
          </h2>
          <p className="mb-6 text-xs font-medium text-rose-600">Once you delete your account, there is no going back. Please be certain.</p>
          
          <button className="rounded-xl border-2 border-rose-200 bg-white px-8 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white hover:border-rose-600 active:scale-95">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
