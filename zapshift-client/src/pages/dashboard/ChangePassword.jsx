import React from "react";
import { MdOutlineSecurity, MdOutlineVpnKey, MdOutlineLockReset } from "react-icons/md";

const ChangePassword = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex items-center justify-between gap-4 border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Security Update</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account access and credentials.</p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-lime-50 flex items-center justify-center text-[#103d45]">
           <MdOutlineSecurity className="text-2xl" />
        </div>
      </div>

      <div className="rounded-[2.5rem] bg-white p-8 sm:p-12 shadow-sm border border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><MdOutlineLockReset className="text-9xl" /></div>
        
        <div className="mx-auto h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
           <MdOutlineVpnKey className="text-3xl text-gray-300" />
        </div>
        
        <h2 className="text-xl font-black text-[#103d45] mb-4">Password Management</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto mb-10">
          To update your password, please use the "Forgot Password" link on the login screen or check your registered email for security links. 
          <br /><br />
          <span className="text-[10px] font-bold uppercase tracking-widest text-lime-600 bg-lime-50 px-3 py-1 rounded-full">Coming Soon: Direct In-App Reset</span>
        </p>

        <div className="pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
           <MdOutlineSecurity className="text-base" /> ZapShift Security Protocol
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
