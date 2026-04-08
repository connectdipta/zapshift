import React, { useState } from "react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);

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
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/services"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Services
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/coverage"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Coverage
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about-us"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/send-parcel"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Send Parcel
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/pricing"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Pricing
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/rider"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Be a Rider
        </NavLink>
      </li>
    </>
  );
  const {user, logout} = useAuth();
  const handleLogout= () => {
    logout()
    .then()
    .catch(error => console.log(error))

  }

  return (
    <div className="navbar bg-base-100 shadow-sm mb-5 relative rounded-2xl mx-2 mt-2 px-4 sticky top-0 z-50">
      <div className="navbar-start">
        <button
          onClick={() => setOpen(!open)}
          className="btn btn-ghost lg:hidden"
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
        </button>

        {open && (
          <ul className="menu bg-base-100 rounded-box absolute top-16 left-3 shadow w-52 p-2 z-50 lg:hidden">
            {links}
          </ul>
        )}

        <Link to="/">
          <Logo />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-2">{links}</ul>
      </div>

      <div className="navbar-end gap-3 flex items-center">
        {user ? (
          <button onClick={handleLogout} className="btn btn-primary rounded-2xl text-secondary">
            Log Out
          </button>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost rounded-2xl text-gray-700 border border-gray-200 hover:bg-gray-100">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary rounded-2xl text-secondary bg-[#D7EB6F] border-none hover:bg-[#c4db5d]">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
