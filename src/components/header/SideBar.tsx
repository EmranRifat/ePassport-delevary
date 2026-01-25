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
    text-white
    bg-gradient-to-b
    from-primary-700 via-primary-700 to-primary-800
    dark:from-gray-900 dark:via-gray-900 dark:to-gray-800
    shadow-xl
  "
>
  {/* 🔹 Header */}
  <div className="px-5 py-4 border-b border-white/10 dark:border-white/5">
    <h2 className="text-lg font-semibold tracking-wide">
      BPO
    </h2>
    <p className="text-xs text-primary-200 dark:text-gray-400">
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
                ? "bg-white/15 dark:bg-white/10 border-l-4 border-white pl-4"
                : "hover:bg-white/10 dark:hover:bg-white/5"
            }
          `}
        >
          {/* Icon */}
          <span
            className={`
              transition-colors
              ${
                isActive
                  ? "text-white"
                  : "text-primary-200 dark:text-gray-400"
              }
              group-hover:text-white
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