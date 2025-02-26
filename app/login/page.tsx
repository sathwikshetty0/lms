

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import bcrypt from "bcryptjs";
import * as jose from 'jose';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [clientInitialized, setClientInitialized] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      setClientInitialized(true);
      console.log("Supabase environment variables loaded");
    } else {
      console.error("Supabase environment variables missing");
      setDebugInfo("Environment variables missing. Check .env.local file.");
    }

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    if (currentPath.includes('/login')) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_data");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDebugInfo("");
    let debugText = "";

    debugText += `Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing"}\n`;
    debugText += `Supabase Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing"}\n\n`;
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setDebugInfo(debugText + "Error: Environment variables not loaded.");
      setLoading(false);
      toast.error("Configuration error. See debug info.");
      return;
    }
    
    try {
      const supabase = createClient();
      
      // Check admin table
      debugText += "Checking admin table...\n";
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select("email, password, role")
        .eq("email", email.trim())
        .single();

      if (!adminError && adminData) {
        debugText += "Admin record found. Comparing passwords.\n";
        if (adminData.password === password) {
          debugText += "Admin password match. Creating JWT...\n";
          setDebugInfo(debugText);
          await createTokenAndRedirect(adminData, "/admin/dashboard");
          return;
        }
      }

      // Check school admin table
      debugText += "Checking school_admin_auth table...\n";
      const { data: schoolAdminData, error: schoolAdminError } = await supabase
        .from("school_admin_auth")
        .select("email, password, role")
        .eq("email", email.trim())
        .single();

      if (!schoolAdminError && schoolAdminData) {
        debugText += "School admin record found. Verifying with bcrypt...\n";
        const isPasswordValid = await bcrypt.compare(
          password,
          schoolAdminData.password
        );
        
        if (isPasswordValid) {
          debugText += "School admin password valid. Creating JWT...\n";
          setDebugInfo(debugText);
          await createTokenAndRedirect(schoolAdminData, "/school-admin/dashboard");
          return;
        }
      }
//teachers tablr
      debugText += "Checking Teachers table...\n";
      const { data: teacherData, error: teacherError } = await supabase
        .from("teacher_auth")
        .select("email, password, role")
        .eq("email", email.trim())
        .single();

        if (!teacherError && teacherData) {
          debugText += "teacher record found. Verifying with bcrypt...\n";
          const isPasswordValid = await bcrypt.compare(
            password,
            teacherData.password
          );
          
          if (isPasswordValid) {
            debugText += "teacher password valid. Creating JWT...\n";
            setDebugInfo(debugText);
            await createTokenAndRedirect(teacherData, "/teacher/dashboard");
            return;
          }
        }
      // Check student table
      debugText += "Checking student_auth table...\n";
      const { data: studentData, error: studentError } = await supabase
        .from("student_auth")
        .select("email, password, role")
        .eq("email", email.trim())
        .single();

      if (!studentError && studentData) {
        debugText += "Student record found. Verifying with bcrypt...\n";
        const isPasswordValid = await bcrypt.compare(
          password,
          studentData.password
        );
        
        if (isPasswordValid) {
          debugText += "Student password valid. Creating JWT...\n";
          setDebugInfo(debugText);
          await createTokenAndRedirect(studentData, "/student/dashboard");
          return;
        }
      }

      debugText += "No matching user found or invalid credentials.\n";
      setDebugInfo(debugText);
      throw new Error("Invalid credentials");
    } catch (err: any) {
      console.error("Login error:", err);
      setDebugInfo(debugText + `\nFinal error: ${err.message}`);
      setLoading(false);
      toast.error(err.message || "An error occurred during login.");
    }
  };

  const createTokenAndRedirect = async (userData: any, path: string) => {
    try {
      const payload = {
        email: userData.email,
        role: userData.role,
        timestamp: Date.now()
      };

      // Create a simple secret key for JWT signing
      const secretKey = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_SECRET_KEY || 'your-secret-key'
      );

      // Create JWT token using jose
      const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secretKey);

      // Store authentication data
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_role", userData.role);
      localStorage.setItem("user_data", JSON.stringify(userData));
      
      console.log("Authentication successful, redirecting to:", path);
      router.push(path);
    } catch (error) {
      console.error("Token creation error:", error);
      setLoading(false);
      toast.error("Authentication error. Please try again.");
    }
  };

  return (
    <div className="flex md:flex-row flex-col justify-center items-center h-dvh lg:gap-20 gap-10 max-w-6xl mx-auto px-5">
      <div className="w-full flex md:justify-end justify-center items-center">
        <Image
          src={"/assets/login.svg"}
          width={500}
          height={500}
          alt="login"
        ></Image>
      </div>
      <div className="flex md:justify-start justify-center items-center w-full">
        <form onSubmit={handleLogin} className="max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {!clientInitialized && (
            <div className="mb-4 p-2 bg-yellow-50 text-yellow-800 text-sm rounded">
              Waiting for Supabase connection... If this persists, check your environment variables.
            </div>
          )}
          <Input
            required
            disabled={loading || !clientInitialized}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Input
            required
            disabled={loading || !clientInitialized}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button disabled={loading || !clientInitialized} type="submit" className="w-full">
            {loading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4 animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            Login
          </Button>
          
          {debugInfo && (
            <div className="mt-4 p-2 bg-gray-100 text-xs font-mono text-gray-800 rounded h-32 overflow-auto">
              <pre>{debugInfo}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;