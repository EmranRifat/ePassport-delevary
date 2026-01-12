"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface MenuItem {
  name: string;
  path: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Bookings", path: "/booking", icon: "📝" },
  { name: "Delivery", path: "/delivery", icon: "🚚" },
  { name: "Passport Status", path: "/passport", icon: "🛂" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <aside
      className={`bg-primary-700 text-white flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-primary-600 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🇧🇩</span>
            <div>
              <h2 className="text-sm font-bold">BPO</h2>
              <p className="text-xs text-primary-200">ePassport Portal</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-primary-600 rounded transition-colors"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors ${
                isActive
                  ? "bg-primary-800 border-l-4 border-white"
                  : "hover:bg-primary-600"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-primary-600">
          <p className="text-xs text-primary-300 text-center">
            © 2026 Bangladesh Post Office
          </p>
        </div>
      )}
    </aside>
  );
}
