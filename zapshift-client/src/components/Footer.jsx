import React from "react";
import { Link } from "react-router";
import { FaLinkedinIn, FaXTwitter, FaFacebookF, FaYoutube } from "react-icons/fa6";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 mt-10">
      <div className="flex flex-col items-center text-center gap-3">
        {/* Logo */}
       <Logo></Logo>

        {/* Description */}
        <p className="max-w-xl text-sm text-gray-300">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to
          business shipments — we deliver on time, every time.
        </p>
      </div>

      {/* Menu */}
      <div className="border-t border-gray-700 mt-8 pt-6">
        <ul className="flex flex-wrap justify-center gap-3 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-300">
          <li><Link className="hover:text-primary active:scale-95 transition" to="/send-parcel">Send Parcel</Link></li>
          <li><Link className="hover:text-primary active:scale-95 transition" to="/coverage">Coverage</Link></li>
          <li><Link className="hover:text-primary active:scale-95 transition" to="/about-us">About Us</Link></li>
          <li><Link className="hover:text-primary active:scale-95 transition" to="/pricing">Pricing</Link></li>
          <li><Link className="hover:text-primary active:scale-95 transition" to="/rider">Be a Rider</Link></li>
          <li><Link className="hover:text-primary active:scale-95 transition" to="/login">Login</Link></li>
        </ul>
      </div>

      {/* Social Icons */}
      <div className="mt-6 flex justify-center gap-5">
        <a aria-label="LinkedIn" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-90 transition" href="https://www.linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn size={18} /></a>
        <a aria-label="X" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-90 transition" href="https://x.com" target="_blank" rel="noreferrer"><FaXTwitter size={18} /></a>
        <a aria-label="Facebook" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-90 transition" href="https://www.facebook.com" target="_blank" rel="noreferrer"><FaFacebookF size={18} /></a>
        <a aria-label="YouTube" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-90 transition" href="https://www.youtube.com" target="_blank" rel="noreferrer"><FaYoutube size={18} /></a>
      </div>

      {/* Credit */}
      <p className="mt-8 text-center text-xs text-gray-500">© 2025 ZapShift — Designed & Developed by DIPTA ACHARJEE</p>
    </footer>
  );
}
