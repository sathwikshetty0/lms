"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      router.push("/login");
      return;
    }

    try {
      const tokenParts = accessToken.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const payload = JSON.parse(atob(tokenParts[1]));

      if (payload.exp && Date.now() >= payload.exp * 1000) {
        localStorage.removeItem("access_token");
        router.push("/login");
        return;
      }

      if (!payload.role || !allowedRoles.includes(payload.role)) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("access_token");
      router.push("/login");
    }
  }, [allowedRoles, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
