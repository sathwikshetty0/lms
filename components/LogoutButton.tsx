"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Remove JWT from localStorage
    localStorage.removeItem("access_token");

    // Optionally, clear other data from localStorage (e.g., user role)
    localStorage.removeItem("role");

    // Redirect to login page
    router.push("/login");
  };

  return (
    <Button size={"icon"} variant={"destructive"} onClick={handleLogout}>
      <LogOut className="w-5 h-5" />
    </Button>
  );
};

export default LogoutButton;
