

// import React from "react";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Sidebar,
//   SidebarHeader,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";

// const items = [
//   { title: "Dashboard", url: "/teacher/dashboard" },
//   { title: "Courses", url: "/teacher/classroom" },
  
// ];

// export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
//   const pathname = usePathname();

//   return (
//     <Sidebar {...props}>
//       <SidebarHeader>
//         <div className="bg-black w-full rounded-md flex justify-center items-center gap-1 tracking-wide my-2 text-center font-black py-3">
//           <span className="text-green-400">THE</span>
//           <span className="text-blue-400">DEXES</span>
//           <span className="text-red-400">COMPANY</span>
//         </div>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu className="flex flex-col gap-3">
//               {items.map((item, index) => (
//                 <SidebarMenuItem key={index}>
//                   <Link href={item.url}>
//                     <Button
//                       variant={
//                         pathname === item.url ? "secondary" : "ghost"
//                       }
//                       className={`w-full ${
//                         pathname === item.url
//                           ? "text-black"
//                           : "text-white/50 hover:bg-white/10 hover:text-white"
//                       }`}
//                     >
//                       <span className="text-left w-full">{item.title}</span>
//                     </Button>
//                   </Link>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }

// export default AppSidebar;

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { title: "Dashboard", icon: <LayoutDashboard size={20} />, url: "/teacher/dashboard" },
  { title: "Classroom", icon: <BookOpen size={20} />, url: "/teacher/classroom" },
  // { title: "Students", icon: <Users size={20} />, url: "/teacher/students" },
  // { title: "Calendar", icon: <Calendar size={20} />, url: "/teacher/calendar" },
  // { title: "Messages", icon: <MessageSquare size={20} />, url: "/teacher/messages" },
  // { title: "Settings", icon: <Settings size={20} />, url: "/teacher/settings" },
];

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className={cn(
      "flex flex-col h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300",
      collapsed ? "w-20" : "w-64",
      className
    )}>
      {/* Logo Area */}
      <div className="p-4 flex justify-center items-center border-b border-slate-700">
        {collapsed ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            TD
          </div>
        ) : (
          <div className="flex items-center space-x-1 py-3">
            <span className="text-xl font-extrabold text-white">
              <span className="text-green-400">THE</span>
              <span className="text-blue-400">DEXES</span>
              <span className="text-red-400">COMPANY</span>
            </span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigation.map((item, index) => (
            <li key={index}>
              <Link href={item.url}>
                <div className={cn(
                  "flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                  pathname === item.url 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                )}>
                  <div className="flex items-center justify-center">
                    {item.icon}
                  </div>
                  {!collapsed && (
                    <span className="ml-3 flex-1 whitespace-nowrap">{item.title}</span>
                  )}
                  {!collapsed && pathname === item.url && (
                    <ChevronRight size={16} />
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Collapse/Expand Button */}
      <div className="border-t border-slate-700 p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg bg-slate-700/50 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <span className="flex items-center">
              <ChevronRight size={16} className="rotate-180 mr-2" />
              Collapse
            </span>
          )}
        </button>
      </div>
      
      {/* Logout Button */}
      <div className="p-4">
        <button className={cn(
          "flex items-center rounded-lg px-3 py-3 text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200 w-full",
          collapsed ? "justify-center" : ""
        )}>
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default AppSidebar;