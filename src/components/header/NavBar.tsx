"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "../ui";
import { useAuthStore } from "@/store";
import { authApi } from "@/lib/api-services";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    authApi.logout();
    clearAuth();
    router.push("/login");
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Add your theme toggle logic here
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="bg-gradient-to-r from-green-50 via-white to-green-50 shadow sticky top-0 z-50">
      <div className="px-2 md:px-3 lg:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setOpen(!open);
                onMenuClick?.();
              }}
              className="md:hidden p-1 rounded hover:bg-gray-100 transition"
            >
              <Menu size={22} />
            </button>
            <div className="w-[40px] h-[40px] relative flex-shrink-0">
              <Image
                src="/bpo.png"
                alt="BPO"
                width={65}
                height={65}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold md:font-bold text-gray-900">
                Bangladesh Post Office
              </span>
              <span className="text-xs md:text-sm text-gray-500">
                ePassport Issuing Portal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-200 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={20} className="text-gray-700" />
              ) : (
                <Moon size={20} className="text-gray-700" />
              )}
            </button>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {user?.name || user?.user_id || "User"}
              </p>
              <p className="text-xs text-gray-500">Welcome</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
