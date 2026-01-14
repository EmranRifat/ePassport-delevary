"use client";

import { useState } from "react";
import Navbar from "@/components/header/NavBar";
import SideBar from "@/components/header/SideBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`mt-16 md:mt-0
            fixed md:static inset-y-0 left-0 z-50 w-64 bg-primary-700
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <SideBar />
        </aside>
        <main className="flex-1 overflow-y-auto p-2 md:p-2 lg:p-4">{children}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
