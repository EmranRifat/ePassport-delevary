"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  BookMarked,

} from "lucide-react";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "Bookings",
    path: "/booking",
    icon: <ClipboardList size={18} />,
  },
  {
    name: "Delivery",
    path: "/delivery",
    icon: <Truck size={18} />,
  },
  {
    name: "Passport Status",
    path: "/passport",
    icon: <BookMarked size={18}/>,
  },
];
 
export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
   <aside
  className="
    h-full w-64 flex flex-col
    text-gray-900 dark:text-gray-100
    bg-white dark:bg-gray-800
     
    shadow-xl
  "
>
  {/* 🔹 Header */}
  <div className="px-5 py-4 border-b border-gray-200 dark:border-white/5">
    <h2 className="text-lg font-semibold tracking-wide">
      BPO
    </h2>
    <p className="text-xs lg:text-sm text-gray-800  dark:text-gray-400">
      ePassport Portal
    </p>
  </div>

  {/* 🔹 Menu */}
  <nav className="flex-1 py-4 space-y-1">
    {menuItems.map((item) => {
      const isActive = pathname === item.path;

      return (
        <button
          key={item.path}
          onClick={() => router.push(item.path)}
          className={`
            group w-full flex items-center gap-3 px-5 py-3
            text-sm font-medium transition-all duration-200
            ${
              isActive
                ? "bg-blue-400 dark:bg-white/10 border-l-4 border-white pl-4"
                : "hover:bg-blue-200 dark:hover:bg-white/5"
            }
          `}
        >
          {/* Icon */}
          <span
            className={`
              transition-colors
              ${
                isActive
                  ? "text-gray-800 dark:text-gray-100"
                  : "text-gray-800 dark:text-gray-100"
              }
              group-hover:text-blue-800 dark:group-hover:text-gray-100
            `}
          >
            {item.icon}
          </span>

          {/* Label */}
          <span className="truncate">{item.name}</span>
        </button>
      );
    })}
  </nav>

  {/* 🔹 Footer */}
  <div className="px-4 py-3 border-t border-white/10 dark:border-white/5">
    <p className="text-[11px] text-primary-200 dark:text-gray-400 text-center">
      © 2026 Bangladesh Post Office
    </p>
  </div>
</aside>

  );
}