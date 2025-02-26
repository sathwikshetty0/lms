// import { jwtDecode } from "jwt-decode";

// export const isAuthenticated = () => {
//   const token = localStorage.getItem("access_token");

//   if (!token) return false;

//   try {
//     const decoded = jwtDecode<any>(token);
//     const expiry = decoded.exp * 1000;

//     if (expiry < Date.now()) {
//       localStorage.removeItem("access_token");
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error("Invalid token", error);
//     return false;
//   }
// };

// utils/auth.ts

// utils/auth.ts
import { createClient } from "@/utils/supabase/client";
import * as jose from 'jose';

export const supabase = createClient();

export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token || !userData) {
      return null;
    }

    return JSON.parse(userData);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const verifyAuth = () => {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');
  
  if (!token || !userRole) {
    return false;
  }
  
  return true;
};

export const getUserProfile = async (email: string, role: 'teacher' | 'student') => {
  try {
    const { data, error } = await supabase
      .from(role === 'teacher' ? 'teachers' : 'students')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching ${role} profile:`, error);
    return null;
  }
};