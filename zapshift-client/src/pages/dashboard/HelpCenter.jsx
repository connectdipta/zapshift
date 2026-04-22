import React from "react";
import { MdOutlineHelpOutline, MdOutlineMarkChatUnread, MdOutlineMenuBook, MdOutlinePhoneInTalk } from "react-icons/md";

const HelpCenter = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex items-center justify-between gap-4 border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Help & Support</h1>
          <p className="mt-1 text-sm text-gray-500">How can we assist you with your ZapShift experience today?</p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-lime-50 flex items-center justify-center text-[#103d45]">
           <MdOutlineHelpOutline className="text-2xl" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {[
           { title: "Knowledge Base", icon: MdOutlineMenuBook, text: "Explore detailed guides and common parcel delivery FAQs." },
           { title: "Live Support", icon: MdOutlineMarkChatUnread, text: "Connect with our dispatch support team via real-time chat." },
           { title: "Phone Line", icon: MdOutlinePhoneInTalk, text: "Urgent issue? Call our global helpline for instant assistance." }
         ].map((item, i) => (
           <div key={i} className="rounded-[2rem] bg-white p-8 border border-gray-100 shadow-sm transition hover:shadow-lg group">
              <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-lime-50 group-hover:text-[#103d45] transition-all mb-6">
                 <item.icon className="text-2xl" />
              </div>
              <h3 className="text-lg font-black text-[#103d45] mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
              <div className="pt-6">
                 <button className="text-[10px] font-black uppercase tracking-widest text-[#103d45] flex items-center gap-2 group-hover:text-lime-600">Access Channel <span className="text-lg">→</span></button>
              </div>
           </div>
         ))}
      </div>

      <div className="rounded-3xl bg-[#103d45] p-8 sm:p-12 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10"><MdOutlineHelpOutline className="text-9xl" /></div>
         <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl font-black mb-4">Enterprise Support</h2>
            <p className="text-sm text-white/60 leading-relaxed mb-8">Operating a high-volume business? Our enterprise support specialists are available 24/7 to manage your custom logistics pipelines and API integrations.</p>
            <button className="rounded-xl bg-[#b8d94a] px-8 py-3 text-xs font-black text-[#103d45] uppercase tracking-widest shadow-lg shadow-black/10">Request Account Manager</button>
         </div>
      </div>
    </div>
  );
};

export default HelpCenter;
