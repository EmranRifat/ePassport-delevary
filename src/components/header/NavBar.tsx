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
     setMobileMenuOpen((prev) => !prev)
  };

  const avatarHandler = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
   
   <header className="sticky top-0 z-50 bg-gradient-to-r from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-sm ">
    <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <button
              onClick={onMenuClick}
              className="md:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Menu size={24} />
            </button>

            <div className="w-7 sm:w-8 md:w-12 md:h-12">
              <Image
                src="/bpo.png"
                alt="BPO"
                width={45}
                height={45}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm md:text-lg xl:text-xl font-bold md:font-bold text-gray-800 dark:text-gray-200">
                Bangladesh Post Office
              </p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-200">
                ePassport Issuing Portal
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex mr-4">
            {/* <div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {user?.name || user?.user_id || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Welcome
              </p>
            </div> */}
            <button
              onClick={avatarHandler}
              className="rounded-full focus:outline-none 
                    hover:ring-2 hover:ring-purple-400 transition"
            >
              <Avatar size="lg" name={user?.name || user?.user_id} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className=" absolute top-16 right-4 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 z-50">
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
            <Button onClick={handleLogout} variant="danger" size="sm">
              Logout
            </Button>
          </div>
        </div>
      )}
        {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
