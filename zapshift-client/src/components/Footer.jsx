import React from "react";
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
        <ul className="flex justify-center gap-8 text-sm text-gray-300">
          <li className="hover:text-primary active:scale-95 transition cursor-pointer">Services</li>
          <li className="hover:text-primary active:scale-95 transition cursor-pointer">Coverage</li>
          <li className="hover:text-primary active:scale-95 transition cursor-pointer">About Us</li>
          <li className="hover:text-primary active:scale-95 transition cursor-pointer">Pricing</li>
          <li className="hover:text-primary active:scale-95 transition cursor-pointer">Blog</li>
          <li className="hover:text-primary active:scale-95 transition cursor-pointer">Contact</li>
        </ul>
      </div>

      {/* Social Icons */}
      <div className="mt-6 flex justify-center gap-5">
        <a className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-90 transition" href="#"><FaLinkedinIn size={18} /></a>
        <a className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-90 transition" href="#"><FaXTwitter size={18} /></a>
        <a className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-90 transition" href="#"><FaFacebookF size={18} /></a>
        <a className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 active:scale-90 transition" href="#"><FaYoutube size={18} /></a>
      </div>

      {/* Credit */}
      <p className="mt-8 text-center text-xs text-gray-500">© 2025 ZapShift — Designed & Developed by DIPTA ACHARJEE</p>
    </footer>
  );
}
