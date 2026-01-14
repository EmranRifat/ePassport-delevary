"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu} from "lucide-react";
import { Button } from "../ui";
import { useAuthStore } from "@/store";
import { authApi } from "@/lib/api-services";


interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    authApi.logout();
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="px-2 md:px-4 lg:px-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setOpen(!open);
                onMenuClick?.();
              }}
              className="md:hidden p-2 rounded hover:bg-gray-100 transition"
            >
              <Menu size={22} />
            </button>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold md:font-bold text-gray-900">
                Bangladesh Post Office
              </span>
              <span className="text-xs md:text-sm text-gray-500">
                ePassport Issuing Portal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
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
