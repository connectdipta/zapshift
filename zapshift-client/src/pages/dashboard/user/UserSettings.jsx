import React, { useState } from "react";
import { MdSettings, MdEmail, MdPerson, MdWarning, MdLock } from "react-icons/md";
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
        confirmButtonColor: "#16a34a",
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
      confirmButtonColor: "#16a34a",
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
      await Swal.fire({
        icon: "error",
        title: "No User Found",
        text: "Please login again and try.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (newPassword.length < 6) {
      await Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "New password must be at least 6 characters.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      await Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "New password and confirm password must match.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const hasPasswordProvider = auth.currentUser?.providerData?.some((provider) => provider.providerId === "password");
    if (!hasPasswordProvider) {
      await Swal.fire({
        icon: "info",
        title: "Google Account",
        text: "This account uses social login. Password change is not available here.",
        confirmButtonColor: "#3b82f6",
      });
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

      await Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been changed successfully.",
        confirmButtonColor: "#16a34a",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Password Update Failed",
        text: error?.message || "Could not update password.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <MdSettings />
          Settings
        </h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MdPerson />
          Profile Settings
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MdEmail className="text-gray-400" />
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MdPerson className="text-gray-400" />
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <input
              type="text"
              value="Customer"
              disabled
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--color-primary)] text-black font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition disabled:bg-gray-400 flex items-center gap-2"
            >
              <IoCheckmarkCircle />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Notification Preferences
        </h2>

        <div className="space-y-4">
          {[
            { label: "Email for parcel updates", id: "parcel_updates" },
            { label: "SMS notifications", id: "sms_notifications" },
            { label: "Promotional emails", id: "promotional" },
          ].map((item) => (
            <label key={item.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(notificationSettings[item.id])}
                onChange={() => handleNotificationToggle(item.id)}
                className="w-4 h-4 rounded border-gray-300 accent-[var(--color-primary)]"
              />
              <span className="ml-3 text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>

        <div className="pt-4">
          <button onClick={handleSaveNotificationSettings} className="bg-[var(--color-primary)] text-black font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2">
            <IoCheckmarkCircle />
            Save Preferences
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MdLock />
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-[var(--color-primary)] text-black font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition disabled:bg-gray-300"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-2xl">
        <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
          <MdWarning />
          Danger Zone
        </h2>
        <button className="border-2 border-red-600 text-red-600 font-semibold px-6 py-2 rounded-lg hover:bg-red-50 transition">
          Delete Account
        </button>
        <p className="text-sm text-red-700 mt-2">
          This action cannot be undone.
        </p>
      </div>
    </div>
  );
};

export default UserSettings;
