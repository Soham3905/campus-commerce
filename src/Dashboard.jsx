import React from "react";
import SDUIRenderer from "./SDUIRenderer";

export default function Dashboard({ onLogout }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 font-['Inter',sans-serif]">
      <header className="sticky top-0 z-50 bg-[#131b2e] text-white px-5 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#4648d4] text-white flex items-center justify-center font-bold text-sm">
            CC
          </div>
          <span className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-base tracking-tight">
            Campus <span className="text-indigo-400">Commerce</span>
          </span>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/30 transition cursor-pointer"
          >
            <span>Sign Out</span>
          </button>
        )}
      </header>

      <main className="flex-1 w-full">
        <SDUIRenderer />
      </main>
    </div>
  );
}
