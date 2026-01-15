"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "../ui";
import { useAuthStore } from "@/store";
import { authApi } from "@/lib/api-services";
import { useTheme } from "next-themes";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { theme, setTheme } = useTheme();

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
          <div className="flex items-center space-x-3">
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

            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
