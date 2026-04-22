import React from "react";
import { MdOutlineStorefront, MdOutlineHub, MdOutlineAppSettingsAlt } from "react-icons/md";

const Stores = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex items-center justify-between gap-4 border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Store Points</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your integrated e-commerce stores and pickup points.</p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-lime-50 flex items-center justify-center text-[#103d45]">
           <MdOutlineStorefront className="text-2xl" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <div className="rounded-[2rem] bg-white p-8 border border-gray-100 shadow-sm text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
               <MdOutlineHub className="text-3xl" />
            </div>
            <h3 className="text-lg font-black text-[#103d45]">API Integration</h3>
            <p className="text-xs text-gray-500 leading-relaxed italic">Connect your Shopify, WooCommerce or custom store via our unified delivery API.</p>
            <div className="pt-4">
               <span className="text-[10px] font-bold uppercase tracking-widest text-lime-600 bg-lime-50 px-3 py-1 rounded-full">In Beta</span>
            </div>
         </div>

         <div className="rounded-[2rem] border-2 border-dashed border-gray-100 p-8 flex flex-col items-center justify-center text-center space-y-4 transition hover:bg-white hover:border-[#b8d94a]">
            <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
               <span className="text-2xl font-black">+</span>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Add New Store</p>
         </div>
      </div>
    </div>
  );
};

export default Stores;
