import React from "react";
import { Link } from "react-router";
import { FaLinkedinIn, FaXTwitter, FaFacebookF, FaYoutube } from "react-icons/fa6";
import Logo from "./Logo";
import { motion } from 'framer-motion';
import { fadeUp } from './motionPresets';

export default function Footer() {
  return (
    <motion.footer className="bg-black text-white py-10 mt-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}>
      <motion.div className="flex flex-col items-center text-center gap-3" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}>
        {/* Logo */}
       <Logo></Logo>

        {/* Description */}
        <p className="max-w-xl text-sm text-gray-300">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to
          business shipments — we deliver on time, every time.
        </p>
      </motion.div>

      {/* Menu */}
      <motion.div className="border-t border-gray-700 mt-8 pt-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.05 }}>
        <ul className="flex flex-wrap justify-center gap-3 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-300">
          <li><Link className="hover:text-primary active:scale-95 transition" to="/send-parcel">Send Parcel</Link></li>
          <li><Link className="hover:text-primary active:scale-95 transition" to="/coverage">Coverage</Link></li>
          <li><Link className="hover:text-primary active:scale-95 transition" to="/about-us">About Us</Link></li>
          <li><Link className="hover:text-primary active:scale-95 transition" to="/pricing">Pricing</Link></li>
          <li><Link className="hover:text-primary active:scale-95 transition" to="/rider">Be a Rider</Link></li>
          <li><Link className="hover:text-primary active:scale-95 transition" to="/login">Login</Link></li>
        </ul>
      </motion.div>

      {/* Social Icons */}
      <motion.div className="mt-6 flex justify-center gap-5" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }}>
        <motion.a whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.92 }} aria-label="LinkedIn" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition" href="https://www.linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn size={18} /></motion.a>
        <motion.a whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.92 }} aria-label="X" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition" href="https://x.com" target="_blank" rel="noreferrer"><FaXTwitter size={18} /></motion.a>
        <motion.a whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.92 }} aria-label="Facebook" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition" href="https://www.facebook.com" target="_blank" rel="noreferrer"><FaFacebookF size={18} /></motion.a>
        <motion.a whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.92 }} aria-label="YouTube" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition" href="https://www.youtube.com" target="_blank" rel="noreferrer"><FaYoutube size={18} /></motion.a>
      </motion.div>

      {/* Credit */}
      <motion.p className="mt-8 text-center text-xs text-gray-500" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.15 }}>© 2025 ZapShift — Designed & Developed by DIPTA ACHARJEE</motion.p>
    </motion.footer>
  );
}
