"use client";

import { useState } from "react";
import Navbar from "@/components/header/NavBar";
import SideBar from "../../components/header/SideBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="flex flex-1 flex-col">
        <div>
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </div>
        <div className="flex gap-2">
          <aside
            className={` mt-16 md:mt-0 fixed inset-y-0 left-0 z-50 w-64 transform bg-primary-700 transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:static md:translate-x-0 `}
          >
            <SideBar />
          </aside>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
export default Layout;
