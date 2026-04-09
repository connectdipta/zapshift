import React, { useEffect, useRef, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  MdDashboard,
  MdLocalShipping,
  MdPeople,
  MdDirectionsBike,
  MdMap,
  MdReceiptLong,
  MdPriceCheck,
  MdPublic,
  MdSettings,
  MdSend,
  MdSearch,
  MdLogout,
  MdMenu,
  MdNotificationsNone,
  MdKeyboardArrowDown,
  MdAccountCircle,
  MdCircle,
} from "react-icons/md";
import Logo from "../components/Logo";
import useAuth from "../hooks/useAuth";
import useCurrentUserRole from "../hooks/useCurrentUserRole";
import axiosSecure from "../hooks/useAxiosSecure";
import RouteTransition from "../components/RouteTransition";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [seenNotificationIds, setSeenNotificationIds] = useState([]);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { role, isAdmin, isRider } = useCurrentUserRole();

  const { data: parcels = [] } = useQuery({
    queryKey: ["dashboard-notification-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data || [];
    },
    refetchInterval: 30000,
  });

  const { data: riderApplications = [] } = useQuery({
    queryKey: ["dashboard-notification-rider-applications"],
    enabled: !!user?.email && isAdmin,
    queryFn: async () => {
      const res = await axiosSecure.get("/users/riders/list");
      return res.data || [];
    },
    refetchInterval: 30000,
  });

  const notificationItems = React.useMemo(() => {
    const items = [];

    const unpaidCount = parcels.filter((p) => String(p.paymentStatus || "").toLowerCase() !== "paid").length;
    const deliveredCount = parcels.filter((p) => String(p.status || "").toLowerCase() === "delivered").length;
    const pickupCount = parcels.filter((p) => String(p.status || "").toLowerCase() === "ready-to-pickup").length;
    const inTransitCount = parcels.filter((p) => String(p.status || "").toLowerCase() === "in-transit").length;
    const pendingApplications = riderApplications.filter((r) => String(r.applicationStatus || "").toLowerCase() === "pending").length;

    if (isAdmin) {
      if (pendingApplications > 0) {
        items.push({
          id: `admin-pending-riders-${pendingApplications}`,
          title: "Pending rider applications",
          description: `${pendingApplications} rider request(s) need review`,
          target: "/dashboard/riders",
        });
      }
      if (unpaidCount > 0) {
        items.push({
          id: `admin-unpaid-parcels-${unpaidCount}`,
          title: "Unpaid parcels detected",
          description: `${unpaidCount} parcel(s) are unpaid`,
          target: "/dashboard/payments",
        });
      }
    }

    if (isRider) {
      if (pickupCount > 0) {
        items.push({
          id: `rider-pickups-${pickupCount}`,
          title: "Pickup tasks available",
          description: `${pickupCount} parcel(s) are ready for pickup`,
          target: "/dashboard/rider/pickups",
        });
      }
      if (inTransitCount > 0) {
        items.push({
          id: `rider-in-transit-${inTransitCount}`,
          title: "In-transit deliveries",
          description: `${inTransitCount} parcel(s) are currently in transit`,
          target: "/dashboard/rider/deliveries",
        });
      }
    }

    if (!isAdmin && !isRider) {
      if (deliveredCount > 0) {
        items.push({
          id: `user-delivered-${deliveredCount}`,
          title: "Delivered parcels update",
          description: `${deliveredCount} parcel(s) have been delivered`,
          target: "/dashboard/user/parcels",
        });
      }
      if (unpaidCount > 0) {
        items.push({
          id: `user-unpaid-${unpaidCount}`,
          title: "Pending payments",
          description: `${unpaidCount} parcel(s) are waiting for payment`,
          target: "/dashboard/user/invoices",
        });
      }
    }

    return items;
  }, [isAdmin, isRider, parcels, riderApplications]);

  const unreadCount = notificationItems.filter((item) => !seenNotificationIds.includes(item.id)).length;

  const adminMenuItemsTop = [
    { name: "Dashboard", path: "/dashboard/admin", icon: MdDashboard },
    { name: "Shipping", path: "/dashboard/parcels", icon: MdLocalShipping },
    { name: "Users", path: "/dashboard/users", icon: MdPeople },
    { name: "Riders", path: "/dashboard/riders", icon: MdDirectionsBike },
    { name: "Delivery Management", path: "/dashboard/delivery", icon: MdMap },
    { name: "Payments", path: "/dashboard/payments", icon: MdReceiptLong },
  ];

  const userMenuItemsTop = [
    { name: "Dashboard", path: "/dashboard/user", icon: MdDashboard },
    { name: "My Parcels", path: "/dashboard/user/parcels", icon: MdLocalShipping },
    { name: "Send Parcel", path: "/dashboard/user/send-parcel", icon: MdSend },
    { name: "Track Parcel", path: "/dashboard/user/track", icon: MdSearch },
    { name: "Invoices", path: "/dashboard/user/invoices", icon: MdReceiptLong },
  ];

  const riderMenuItemsTop = [
    { name: "Dashboard", path: "/dashboard/rider", icon: MdDashboard },
    { name: "Pickup Tasks", path: "/dashboard/rider/pickups", icon: MdDirectionsBike },
    { name: "Deliveries", path: "/dashboard/rider/deliveries", icon: MdLocalShipping },
    { name: "History", path: "/dashboard/rider/history", icon: MdReceiptLong },
  ];

  const menuItemsTop = isAdmin ? adminMenuItemsTop : isRider ? riderMenuItemsTop : userMenuItemsTop;

  const menuItemsGeneral = [
    { name: "Pricing Plan", path: "/dashboard/pricing-plan", icon: MdPriceCheck },
    { name: "Coverage Area", path: "/dashboard/coverage-area", icon: MdPublic },
    { name: "Settings", path: "/dashboard/settings", icon: MdSettings },
  ];

  const isActive = (path) => location.pathname === path;

  const markAllNotificationsAsRead = () => {
    const ids = notificationItems.map((item) => item.id);
    setSeenNotificationIds(ids);
  };

  const openNotification = (item) => {
    setSeenNotificationIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
    setNotificationOpen(false);
    navigate(item.target);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (!user?.email) return;

    const key = `zapshift_notifications_seen_${user.email}`;
    const storedIds = JSON.parse(localStorage.getItem(key) || "[]");
    if (Array.isArray(storedIds)) {
      setSeenNotificationIds(storedIds);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;
    const key = `zapshift_notifications_seen_${user.email}`;
    localStorage.setItem(key, JSON.stringify(seenNotificationIds));
  }, [seenNotificationIds, user?.email]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setProfileOpen(false);
    setNotificationOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#efefef]">
      <div className="mx-auto flex w-full max-w-[1400px]">
        {sidebarOpen && (
          <button
            className="fixed inset-0 z-20 bg-black/25 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}

        <aside className={`fixed inset-y-0 left-0 z-30 min-h-screen border-r border-[#e8e8e8] bg-[#f4f4f4] px-4 py-5 transition-all duration-200 lg:static lg:translate-x-0 ${desktopSidebarCollapsed ? "lg:w-[82px]" : "lg:w-[230px]"} ${sidebarOpen ? "translate-x-0 w-[230px]" : "-translate-x-full w-[230px]"}`}>
          <div className="mb-6 flex items-center justify-between">
            <Link to="/">
              <Logo compact={desktopSidebarCollapsed && !sidebarOpen} />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1 text-gray-500 hover:bg-white lg:hidden"
            >
              <MdMenu className="text-lg" />
            </button>
          </div>

          <p className="mb-2 px-2 text-[10px] font-semibold tracking-wide text-gray-400">MENU</p>
          <div className="space-y-1">
            {menuItemsTop.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs transition ${
                    isActive(item.path)
                      ? "bg-[#caeb66] font-semibold text-[#111]"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  <Icon className="text-sm" />
                  {!desktopSidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>

          <p className="mb-2 mt-6 px-2 text-[10px] font-semibold tracking-wide text-gray-400">GENERAL</p>
          <div className="space-y-1">
            {menuItemsGeneral.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs transition ${
                    isActive(item.path)
                      ? "bg-[#caeb66] font-semibold text-[#111]"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  <Icon className="text-sm" />
                  {!desktopSidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-gray-600 transition hover:bg-white"
            >
              <MdLogout className="text-sm" />
              {!desktopSidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="sticky top-0 z-10 border-b border-[#e4e4e4] bg-[#f4f4f4] px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (window.innerWidth >= 1024) {
                    setDesktopSidebarCollapsed((prev) => !prev);
                  } else {
                    setSidebarOpen(true);
                  }
                }}
                className="rounded-md p-1 text-gray-600 hover:bg-white"
                aria-label="Open sidebar"
              >
                <MdMenu className="text-lg" />
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <div className="relative hidden sm:block" ref={notificationRef}>
                  <button
                    onClick={() => setNotificationOpen((prev) => !prev)}
                    className="relative rounded-full border border-[#e0e0e0] bg-white p-2 text-gray-500"
                  >
                    <MdNotificationsNone className="text-sm" />
                    {unreadCount > 0 ? (
                      <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    ) : null}
                  </button>

                  {notificationOpen ? (
                    <div className="absolute right-0 mt-2 w-80 rounded-lg border border-[#e5e5e5] bg-white p-2 shadow-lg">
                      <div className="mb-2 flex items-center justify-between px-2 py-1">
                        <p className="text-xs font-semibold text-gray-800">Notifications</p>
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] font-medium text-[#6f8f24] hover:underline"
                        >
                          Mark all read
                        </button>
                      </div>

                      <div className="max-h-72 space-y-1 overflow-auto">
                        {notificationItems.length === 0 ? (
                          <p className="px-2 py-4 text-center text-xs text-gray-500">No notifications available</p>
                        ) : (
                          notificationItems.map((item) => {
                            const isRead = seenNotificationIds.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                onClick={() => openNotification(item)}
                                className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left hover:bg-[#f5f5f5]"
                              >
                                <MdCircle className={`mt-1 text-[9px] ${isRead ? "text-transparent" : "text-[#caeb66]"}`} />
                                <div>
                                  <p className="text-xs font-semibold text-gray-800">{item.title}</p>
                                  <p className="text-[11px] text-gray-500">{item.description}</p>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="relative hidden sm:block" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-full border border-[#e0e0e0] bg-white px-2 py-1"
                  >
                    <div className="h-7 w-7 overflow-hidden rounded-full bg-[#dcdcdc]">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="User" className="h-full w-full object-cover" />
                      ) : (
                        <MdAccountCircle className="h-full w-full text-[#8c8c8c]" />
                      )}
                    </div>
                    <div className="leading-tight text-left">
                      <p className="text-[11px] font-semibold text-gray-800">{user?.displayName || "User"}</p>
                      <p className="text-[10px] text-gray-400">{role}</p>
                    </div>
                    <MdKeyboardArrowDown className="text-sm text-gray-500" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-lg border border-[#e5e5e5] bg-white p-1 shadow-lg">
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-gray-700 hover:bg-[#f3f3f3]"
                      >
                        <MdDashboard className="text-sm" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          navigate("/dashboard/settings");
                          setProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-gray-700 hover:bg-[#f3f3f3]"
                      >
                        <MdSettings className="text-sm" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-red-600 hover:bg-[#fff1f1]"
                      >
                        <MdLogout className="text-sm" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <RouteTransition>
              <Outlet />
            </RouteTransition>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;