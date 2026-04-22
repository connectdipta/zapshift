import React, { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import { Link, NavLink, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { AnimatePresence, motion } from 'framer-motion';
import { fadeUp, springTransition } from './motionPresets';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const activeClass =
    "bg-[var(--color-primary)] text-black rounded-full px-4 py-2 font-semibold";
  const inactiveClass =
    "text-gray-600 hover:text-gray-900 rounded-full px-4 py-2 transition";

  const links = (
    <>
      <li>
        <NavLink
          end
          to="/"
          onClick={() => {
            setOpen(false);
            setShowProfileMenu(false);
          }}
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/coverage"
          onClick={() => {
            setOpen(false);
            setShowProfileMenu(false);
          }}
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Coverage
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about-us"
          onClick={() => {
            setOpen(false);
            setShowProfileMenu(false);
          }}
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/send-parcel"
          onClick={() => {
            setOpen(false);
            setShowProfileMenu(false);
          }}
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Send Parcel
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/pricing"
          onClick={() => {
            setOpen(false);
            setShowProfileMenu(false);
          }}
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Pricing
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/rider"
          onClick={() => {
            setOpen(false);
            setShowProfileMenu(false);
          }}
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Be a Rider
        </NavLink>
      </li>
    </>
  );
  const { user, logout } = useAuth();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleLogout = () => {
    logout()
      .then(() => {
        setShowProfileMenu(false);
        navigate("/");
      })
      .catch(error => console.log(error));
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    setShowProfileMenu(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
  };

  const handleNavClick = () => {
    setOpen(false);
    setShowProfileMenu(false);
  };

  return (
    <motion.div
      className="navbar bg-base-100 shadow-sm mb-5 relative rounded-2xl mx-2 mt-2 px-4 sticky top-0 z-50"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <motion.div className="navbar-start" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
        <motion.button
          onClick={() => setOpen(!open)}
          className="btn btn-ghost lg:hidden"
          whileTap={{ scale: 0.94 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.ul
              className="menu bg-base-100 rounded-box absolute top-16 left-3 shadow w-52 p-2 z-50 lg:hidden"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={springTransition}
            >
              {links}
            </motion.ul>
          )}
        </AnimatePresence>

        <Link to="/">
          <Logo />
        </Link>
      </motion.div>

      <motion.div className="navbar-center hidden lg:flex" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <ul className="menu menu-horizontal px-2">{links}</ul>
      </motion.div>

      <motion.div className="navbar-end gap-3 flex items-center" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        {user ? (
          <div className="relative" ref={profileMenuRef}>
            <motion.button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-black font-bold flex items-center justify-center hover:shadow-lg transition cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                getInitials(user?.displayName)
              )}
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
              <motion.div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50" initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={springTransition}>
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleDashboard}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-2m-9-2h.01"
                    />
                  </svg>
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition border-t border-gray-100"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost rounded-2xl text-gray-700 border border-gray-200 hover:bg-gray-100 h-9 min-h-9 px-3 text-sm max-sm:px-2 max-sm:text-xs">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary rounded-2xl text-secondary bg-[#D7EB6F] border-none hover:bg-[#c4db5d] h-9 min-h-9 px-3 text-sm max-sm:px-2 max-sm:text-xs">
              Sign Up
            </Link>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Navbar;
