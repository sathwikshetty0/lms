"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <Navbar />
          <div className="px-5 w-full">{children}</div>
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}