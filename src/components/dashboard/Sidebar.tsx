"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Users", href: "/users" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-800 transition-all duration-300 shadow-sm dark:shadow-gray-800",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b dark:border-gray-800">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="text-gray-900 dark:text-gray-100" />
          ) : (
            <ChevronLeft className="text-gray-900 dark:text-gray-100" />
          )}
        </Button>
      </div>

      <nav className="space-y-2 p-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
              pathname === item.href
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100",
            )}
          >
            <item.icon className="h-5 w-5 text-gray-900 dark:text-gray-100" />
            {!collapsed && (
              <span className="text-gray-900 dark:text-gray-100">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
