"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Import shadcn UI components
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Import icons
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  BarChart,
  GraduationCap
} from "lucide-react";

const AppSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/teacher/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Students", href: "/teacher/students", icon: <Users size={20} /> },
    { name: "Courses", href: "/teacher/courses", icon: <BookOpen size={20} /> },
    { name: "Calendar", href: "/teacher/calendar", icon: <Calendar size={20} /> },
    { name: "Assignments", href: "/teacher/assignments", icon: <FileText size={20} /> },
    { name: "Messages", href: "/teacher/messages", icon: <MessageSquare size={20} /> },
    { name: "Grades", href: "/teacher/grades", icon: <GraduationCap size={20} /> },
    { name: "Reports", href: "/teacher/reports", icon: <BarChart size={20} /> }
  ];

  // Handle logout
  const handleLogout = () => {
    // For now, just remove items from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_data");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar backdrop for mobile */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen bg-white border-r z-40 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } flex flex-col shadow-md`}
      >
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/teacher/dashboard" className="flex items-center">
            <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-lg mr-2">
              E
            </div>
            {!collapsed && <span className="font-bold text-xl">EduSync</span>}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-8 w-8 p-0 hidden lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={18} />
          </Button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          collapsed ? "px-3" : "px-4"
                        } ${isActive ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""}`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {!collapsed && <span>{item.name}</span>}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/teacher/settings">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${collapsed ? "px-3" : "px-4"}`}
                  >
                    <span className="mr-3">
                      <Settings size={20} />
                    </span>
                    {!collapsed && <span>Settings</span>}
                  </Button>
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <p>Settings</p>
                </TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${collapsed ? "px-3" : "px-4"} text-red-500 hover:text-red-600 hover:bg-red-50`}
                  onClick={handleLogout}
                >
                  <span className="mr-3">
                    <LogOut size={20} />
                  </span>
                  {!collapsed && <span>Logout</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <p>Logout</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;