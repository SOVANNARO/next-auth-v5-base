"use client";

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { Session } from "@/types/login/auth";
import { useTheme } from "next-themes"; // Import useTheme hook
import { Button } from "@/components/ui/button"; // Import Button component

const Header = () => {
  const { data: session } = useSession() as { data: Session | null };
  const router = useRouter();
  const { setTheme } = useTheme(); // Use the useTheme hook

  return (
    <header className="h-16 bg-white border-b px-4 flex items-center justify-end shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center gap-4">
        {/* Dark/Light Mode Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar>
              <AvatarImage src={session?.user?.avatar || ""} />
              <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
