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
    //  setMobileMenuOpen((prev) => !prev)
  };

  const avatarHandler = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 bg-[#006A4E] text-white dark:bg-gray-800  shadow-sm ">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <button
              onClick={onMenuClick}
              className="md:hidden p-1 rounded "
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
              <p className="text-sm md:text-lg xl:text-xl font-bold md:font-bold text-gray-50">
                Bangladesh Post Office
              </p>
              <p className="text-xs md:text-sm text-gray-50">
                ePassport Issuing Portal
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex gap-2 mr-4">
            {/* Theme Toggle */}
            <button
              onClick={themeHandler}
              className="flex items-center   px-3    rounded-full  "
            >
              {theme === "dark" ? (
                <>
                  <Sun size={24} className="text-yellow-400" />
                </>
                
              ) : (
                <>
                  <Moon
                    size={24}
                    className="text-gray-100"
                  />
                </>
              )}
            </button>

            <div className="flex gap-2">
              <button
                onClick={avatarHandler}
                className="rounded-full focus:outline-none 
                    hover:ring-2  transition"
              >
                <Avatar   size="lg" name={user?.name || user?.user_id} />
              </button>
              <p className="flex items-center text-base text-gray-50">
                {user?.name || user?.user_id || "User"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className=" absolute top-16 right-12 w-35 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="flex flex-col px-4 py-3 space-y-2">
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
