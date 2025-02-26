
// "use client";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Chatbot from "@/components/ui/chatbot";
// import { createClient } from "@/utils/supabase/client";
// import { 
//   BotIcon, 
//   User,
//   Mail,
//   BookOpen,
//   School,
//   Calendar
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { useRouter } from 'next/navigation';
// import { toast } from "sonner";

// const supabase = createClient();

// type Student = {
//   id: string;
//   name: string;
//   email: string;
//   age: number;
//   class: string;
//   school_name: string;
//   courses_enrolled: string[];
//   assignments: Array<{
//     title: string;
//     due_date: string;
//     status: "pending" | "submitted";
//   }>;
// };

// export default function StudentDashboard() {
//   const router = useRouter();
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [studentData, setStudentData] = useState<Student | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkAuthAndFetchData();
//   }, []);

//   const checkAuthAndFetchData = async () => {
//     try {
//       const token = localStorage.getItem('access_token');
//       const userData = localStorage.getItem('user_data');
      
//       if (!token || !userData) {
//         router.push('/login');
//         return;
//       }

//       const parsedUserData = JSON.parse(userData);
//       await fetchStudentData(parsedUserData.email);
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error("Error loading dashboard data");
//       router.push('/login');
//     }
//   };

//   const fetchStudentData = async (email: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('students')
//         .select('*')
//         .eq('email', email)

//         .single();

//       if (error) throw error;
//       setStudentData(data);
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error("Error fetching student data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('user_role');
//     localStorage.removeItem('user_data');
//     router.push('/login');
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-7xl mx-auto space-y-6"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-gray-800">Student Dashboard</h2>
//           <div className="flex items-center gap-4">
//             <div className="text-sm text-gray-600">{new Date().toLocaleDateString()}</div>
//             <Button
//               onClick={handleLogout}
//               variant="outline"
//               className="flex items-center gap-2"
//             >
//               Logout
//             </Button>
//           </div>
//         </div>

//         {/* Student Info Card */}
//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
//           <CardHeader className="border-b pb-4">
//             <CardTitle className="flex items-center gap-3">
//               <User className="h-6 w-6 text-blue-500" />
//               Student Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="grid md:grid-cols-2 gap-4 pt-4">
//             <div className="space-y-3">
//               <p className="flex items-center gap-2 text-gray-600">
//                 <User className="h-4 w-4" /> {studentData?.name || "Not available"}
//               </p>
//               <p className="flex items-center gap-2 text-gray-600">
//                 <Mail className="h-4 w-4" /> {studentData?.email || "Not available"}
//               </p>
//               <p className="flex items-center gap-2 text-gray-600">
//                 <Calendar className="h-4 w-4" /> Age: {studentData?.age || "Not available"}
//               </p>
//             </div>
//             <div className="space-y-3">
//               <p className="flex items-center gap-2 text-gray-600">
//                 <BookOpen className="h-4 w-4" /> Class: {studentData?.class || "Not available"}
//               </p>
//               <p className="flex items-center gap-2 text-gray-600">
//                 <School className="h-4 w-4" /> {studentData?.school_name || "Not available"}
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Enrolled Courses */}
//         <Card>
//           <CardHeader className="border-b">
//             <CardTitle>Enrolled Courses</CardTitle>
//           </CardHeader>
//           <CardContent className="pt-4">
//             <div className="grid md:grid-cols-2 gap-4">
//               {studentData?.courses_enrolled?.length ? (
//                 studentData.courses_enrolled.map((course, index) => (
//                   <div 
//                     key={index}
//                     className="p-3 bg-blue-50 rounded-lg text-blue-700 font-medium"
//                   >
//                     {course}
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-3 text-gray-500">No courses enrolled</div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Assignments */}
//         <Card>
//           <CardHeader className="border-b">
//             <CardTitle>Assignments</CardTitle>
//           </CardHeader>
//           <CardContent className="pt-4">
//             <div className="space-y-4">
//               {studentData?.assignments?.length ? (
//                 studentData.assignments.map((assignment, index) => (
//                   <div 
//                     key={index}
//                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//                   >
//                     <div>
//                       <p className="font-medium text-gray-800">{assignment.title}</p>
//                       <p className="text-sm text-gray-600">Due: {assignment.due_date}</p>
//                     </div>
//                     <span 
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         assignment.status === "submitted" 
//                           ? "bg-green-100 text-green-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {assignment.status}
//                     </span>
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-4 text-gray-500">No assignments available</div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Chatbot Button - Fixed in position */}
//         <div className="fixed bottom-6 right-6 z-50">
//           <Button
//             onClick={() => setIsChatOpen(!isChatOpen)}
//             className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
//           >
//             <BotIcon className="w-8 h-8" />
//           </Button>
//         </div>

//         {/* Chatbot Component */}
//         {isChatOpen && (
//           <div className="fixed bottom-24 right-6 z-50">
//             <Chatbot />
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chatbot from "@/components/ui/chatbot";
import { createClient } from "@/utils/supabase/client";
import { 
  BotIcon, 
  User,
  Mail,
  BookOpen,
  School,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

const supabase = createClient();

type Student = {
  id: string;
  name: string;
  email: string;
  age: number;
  class: string;
  school_admin_id?: string; // Made optional
  courses_enrolled: string[];
  assignments: Array<{
    title: string;
    due_date: string;
    status: "pending" | "submitted";
  }>;
};

export default function StudentDashboard() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [studentData, setStudentData] = useState<(Student & { school_name?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');
      
      if (!token || !userData) {
        console.log('No token or user data found');
        router.push('/login');
        return;
      }

      const parsedUserData = JSON.parse(userData);
      if (!parsedUserData.email) {
        console.error('No email found in user data');
        toast.error("Invalid user data");
        router.push('/login');
        return;
      }

      await fetchStudentData(parsedUserData.email);
    } catch (error) {
      console.error('Authentication check error:', error);
      toast.error("Error checking authentication");
      router.push('/login');
    }
  };

  const fetchStudentData = async (email: string) => {
    try {
      console.log('Fetching student data for email:', email);
      
      // Fetch student data
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('email', email)
        .single();

      if (studentError) {
        console.error('Student data fetch error:', studentError);
        throw studentError;
      }

      if (!studentData) {
        console.error('No student data found for email:', email);
        toast.error("Student not found");
        return;
      }

      // Set student data without school information first
      setStudentData({
        ...studentData,
        school_name: "School information unavailable"
      });

      // Try to fetch school information if available
      try {
        if (studentData.school_admin_id) {
          const { data: schoolData, error: schoolError } = await supabase
            .from('school_admins') // Changed from school_admin to schools
            .select('school_name') // Assuming the column is named 'name' instead of 'school_name'
            .eq('id', studentData.school_admin_id)
            .single();

          if (!schoolError && schoolData) {
            setStudentData(prevData => ({
              ...prevData!,
              school_name: schoolData.school_name
            }));
          }
        }
      } catch (schoolError) {
        console.log('Could not fetch school data:', schoolError);
        // Don't throw error, just continue with default school name
      }
    } catch (error: any) {
      console.error('Data fetch error:', error);
      toast.error(error.message || "Error fetching student data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_data');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Student Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">{new Date().toLocaleDateString()}</div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Student Info Card */}
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center gap-3">
              <User className="h-6 w-6 text-blue-500" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" /> {studentData?.name || "Not available"}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" /> {studentData?.email || "Not available"}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" /> Age: {studentData?.age || "Not available"}
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-600">
                <BookOpen className="h-4 w-4" /> Class: {studentData?.class || "Not available"}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <School className="h-4 w-4" /> {studentData?.school_name || "School information unavailable"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Enrolled Courses */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {studentData?.courses_enrolled?.length ? (
                studentData.courses_enrolled.map((course, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-blue-50 rounded-lg text-blue-700 font-medium"
                  >
                    {course}
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500">No courses enrolled</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Assignments</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {studentData?.assignments?.length ? (
                studentData.assignments.map((assignment, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{assignment.title}</p>
                      <p className="text-sm text-gray-600">Due: {assignment.due_date}</p>
                    </div>
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        assignment.status === "submitted" 
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">No assignments available</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chatbot Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
          >
            <BotIcon className="w-8 h-8" />
          </Button>
        </div>

        {/* Chatbot Component */}
        {isChatOpen && (
          <div className="fixed bottom-24 right-6 z-50">
            <Chatbot />
          </div>
        )}
      </motion.div>
    </div>
  );
}