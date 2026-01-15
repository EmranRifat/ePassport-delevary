"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "../ui";
import { useAuthStore } from "@/store";
import { authApi } from "@/lib/api-services";
import { useTheme } from "next-themes";
import Avatar from "../ui/Avatar";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  const handleLogout = () => {
    authApi.logout();
    clearAuth();
    router.push("/login");
  };

  const themeHandler = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-green-50 via-white to-green-50 dark:from-gray-700 dark:via-gray-900 dark:to-gray-800 shadow">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <button
              onClick={onMenuClick}
              className="md:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-400"
            >
              <Menu size={22} />
            </button>

            <Image src="/bpo.png" alt="BPO" width={40} height={40} priority />

            <div>
              <p className="text-sm md:text-lg xl:text-xl font-semibold md:font-bold text-gray-800 dark:text-gray-200">
                Bangladesh Post Office
              </p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-200">
                ePassport Issuing Portal
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex md:hidden gap-2">
           <div>
             <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {user?.name || user?.user_id || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Welcome</p>

           </div>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden rounded-full focus:outline-none 
                    hover:ring-2 hover:ring-purple-400 transition"
            >
              <Avatar name={user?.name || user?.user_id} />
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={themeHandler}
              className="p-2 md:p-3 rounded-full bg-gray-200 dark:bg-gray-600"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-gray-700" />
              )}
            </button>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {user?.name || user?.user_id || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Welcome
              </p>
            </div>

            <Button variant="danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-4 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="flex flex-col p-2 space-y-2">
            {/* Theme Toggle */}
            <button
              onClick={themeHandler}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <>
                  <Sun size={16} className="text-yellow-400" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    Light Mode
                  </span>
                </>
              ) : (
                <>
                  <Moon
                    size={16}
                    className="text-gray-700 dark:text-gray-300"
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    Dark Mode
                  </span>
                </>
              )}
            </button>

            {/* Logout */}
            <Button
              onClick={handleLogout}
             variant="danger" 
             size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
