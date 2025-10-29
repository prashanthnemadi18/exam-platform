"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FilePlus2,
  BarChart3,
  LogOut,
  GraduationCap,
  Settings,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/students", icon: Users, label: "Students" },
  { href: "/dashboard/create-exam", icon: FilePlus2, label: "Create Exam" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r border-amber-200 bg-gradient-to-b from-white to-amber-50/50 sm:flex shadow-lg">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/dashboard"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-xl antique-gradient text-lg font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-110"
          >
            <GraduationCap className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">AssessAI</span>
          </Link>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-110",
                      isActive 
                        ? "antique-gradient text-white shadow-md" 
                        : "bg-amber-100/50 text-amber-800 hover:bg-amber-200/70 border border-amber-200"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-amber-900 text-white border-amber-700">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/50 text-amber-800 transition-all hover:bg-amber-200/70 hover:scale-110 border border-amber-200"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-amber-900 text-white border-amber-700">
              Settings
            </TooltipContent>
          </Tooltip>
           <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700 transition-all hover:bg-red-200 hover:scale-110 border border-red-300"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-red-900 text-white border-red-700">
              Logout
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
