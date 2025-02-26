// // "use client";
// // import { useEffect, useState } from "react";
// // import { createClient } from "@/utils/supabase/client";
// // import { Button } from "@/components/ui/button";
// // import Chatbot from "../../../components/ui/chatbot"; 
// // import { BotIcon } from "lucide-react"; 
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { 
// //   User, 
// //   Mail, 
// //   BookOpen, 
// //   School, 
// //   Users,
// //   ChevronDown,
// //   ChevronUp,
// //   Video,
// //   FileText,
// //   X
// // } from "lucide-react";
// // import { motion } from "framer-motion";
// // import { useRouter } from 'next/navigation';
// // import { toast } from "sonner";

// // interface Teacher {
// //   id: string;
// //   name: string;
// //   email: string;
// //   class_assigned: string;
// //   school_admin_id: string;
// // }

// // interface Student {
// //   id: string;
// //   name: string;
// //   email: string;
// //   class: string;
// // }

// // interface Course {
// //   id: string;
// //   name: string;
// //   class: string;
// //   order: number;
// // }

// // interface Scene {
// //   id: string;
// //   title: string;
// //   description: string;
// //   video_url: string;
// //   course_id: string;
// //   order: number;
// // }

// // interface Assignment {
// //   id: string;
// //   title: string;
// //   description: string;
// //   due_date: string;
// //   course_id: string;
// // }

// // const TeacherDashboard = () => {
// //   const [showChatbot, setShowChatbot] = useState(false); 
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(true);
// //   const [teacherData, setTeacherData] = useState<Teacher | null>(null);
// //   const [schoolName, setSchoolName] = useState<string>("");
// //   const [sectionStudents, setSectionStudents] = useState<Student[]>([]);
// //   const [schoolStudents, setSchoolStudents] = useState<Student[]>([]);
// //   const [courses, setCourses] = useState<Course[]>([]);
// //   const [scenes, setScenes] = useState<Scene[]>([]);
// //   const [assignments, setAssignments] = useState<Assignment[]>([]);
// //   const [showSectionStudents, setShowSectionStudents] = useState(false);
// //   const [showSchoolStudents, setShowSchoolStudents] = useState(false);
// //   const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
// //   const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

// //   const supabase = createClient();
// //   const toggleChatbot = () => {
// //     setShowChatbot(!showChatbot); // Toggle the chatbot visibility
// //   };

// //   useEffect(() => {
// //     checkAuthAndFetchData();
// //   }, []);

// //   const checkAuthAndFetchData = async () => {
// //     try {
// //       const token = localStorage.getItem('access_token');
// //       const userData = localStorage.getItem('user_data');
      
// //       if (!token || !userData) {
// //         router.push('/login');
// //         return;
// //       }

// //       const parsedUserData = JSON.parse(userData);
// //       await fetchTeacherData(parsedUserData.email);
// //     } catch (error) {
// //       console.error('Error:', error);
// //       toast.error("Error loading dashboard data");
// //       router.push('/login');
// //     }
// //   };

// //   const fetchTeacherData = async (email: string) => {
// //     try {
// //       // Fetch teacher data
// //       const { data: teacher, error: teacherError } = await supabase
// //         .from('teachers')
// //         .select('*')
// //         .eq('email', email)
// //         .single();

// //       if (teacherError) throw teacherError;
// //       setTeacherData(teacher);

// //       // Fetch school name
// //       const { data: schoolData } = await supabase
// //         .from('school_admins')
// //         .select('school_name')
// //         .eq('id', teacher.admin_id)
// //         .single();

// //       if (schoolData) {
// //         setSchoolName(schoolData.school_name);
// //       }

// //       // Fetch section students
// //       const { data: sectionStudentsData } = await supabase
// //         .from('students')
// //         .select('*')
// //         .eq('class', teacher.class_assigned);

// //       if (sectionStudentsData) {
// //         setSectionStudents(sectionStudentsData);
// //       }

// //       // Fetch all school students
// //       const { data: schoolStudentsData } = await supabase
// //         .from('students')
// //         .select('*')
// //         .eq('school_admin_id', teacher.admin_id);

// //       if (schoolStudentsData) {
// //         setSchoolStudents(schoolStudentsData);
// //       }

// //       // Fetch courses ordered by their order field
// //       const { data: coursesData } = await supabase
// //         .from('courses')
// //         .select('*')
// //         .eq('class_id', teacher.class_id);

// //       if (coursesData) {
// //         setCourses(coursesData);
// //       }

// //       // Fetch scenes ordered by their order field
// //       const { data: scenesData } = await supabase
// //         .from('scenes')
// //         .select('*')
// //         .order('name', { ascending: true });

// //       if (scenesData) {
// //         setScenes(scenesData);
// //       }

// //       // Fetch assignments
// //       const { data: assignmentsData } = await supabase
// //         .from('assignments')
// //         .select('*')
// //         .order('created_at', { ascending: true });

// //       if (assignmentsData) {
// //         setAssignments(assignmentsData);
// //       }

// //     } catch (error) {
// //       console.error('Error:', error);
// //       toast.error("Error fetching data");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem('access_token');
// //     localStorage.removeItem('user_role');
// //     localStorage.removeItem('user_data');
// //     router.push('/login');
// //   };

// //   const getStudentStats = () => {
// //     return {
// //       sectionCount: sectionStudents.length,
// //       schoolCount: schoolStudents.length
// //     };
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //       </div>
// //     );
// //   }

// //   const stats = getStudentStats();

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-8">
// //       <motion.div 
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.5 }}
// //         className="max-w-7xl mx-auto space-y-8"
// //       >
// //         {/* Header */}
// //         <div className="flex justify-between items-center mb-8">
// //           <h2 className="text-4xl font-bold text-gray-800">Teacher Dashboard</h2>
// //           <div className="flex items-center gap-4">
// //             <div className="text-lg text-gray-600">{new Date().toLocaleDateString()}</div>
// //             <Button
// //               onClick={handleLogout}
// //               variant="outline"
// //               size="lg"
// //               className="text-lg"
// //             >
// //               Logout
// //             </Button>
// //           </div>
// //         </div>

// //         {/* Teacher Info Card */}
// //         <Card className="bg-white shadow-lg">
// //           <CardHeader className="border-b pb-6">
// //             <CardTitle className="flex items-center gap-3 text-2xl">
// //               <User className="h-8 w-8 text-blue-500" />
// //               Teacher Information
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
// //             <div className="space-y-4">
// //               <p className="flex items-center gap-3 text-xl text-gray-600">
// //                 <User className="h-6 w-6" /> {teacherData?.name}
// //               </p>
// //               <p className="flex items-center gap-3 text-xl text-gray-600">
// //                 <Mail className="h-6 w-6" /> {teacherData?.email}
// //               </p>
// //             </div>
// //             <div className="space-y-4">
// //               <p className="flex items-center gap-3 text-xl text-gray-600">
// //                 <BookOpen className="h-6 w-6" /> Class: {teacherData?.class_assigned}
// //               </p>
// //               <p className="flex items-center gap-3 text-xl text-gray-600">
// //                 <School className="h-6 w-6" /> {schoolName}
// //               </p>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Statistics Cards */}
// //         <div className="grid md:grid-cols-2 gap-6">
// //           {/* Student Statistics Card */}
// //           <Card className="bg-white shadow-lg">
// //             <CardHeader>
// //               <CardTitle className="text-2xl">Student Statistics</CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
// //                 <span className="text-lg font-medium">Class Students</span>
// //                 <span className="text-2xl font-bold text-blue-600">{stats.sectionCount}</span>
// //               </div>
// //               <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
// //                 <span className="text-lg font-medium">School Students</span>
// //                 <span className="text-2xl font-bold text-green-600">{stats.schoolCount}</span>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Student Lists Card */}
// //           <Card className="bg-white shadow-lg">
// //             <CardHeader className="flex flex-row items-center justify-between">
// //               <CardTitle className="text-2xl">Student Lists</CardTitle>
// //               <div className="space-x-2">
// //                 <Button
// //                   variant="outline"
// //                   onClick={() => setShowSectionStudents(!showSectionStudents)}
// //                 >
// //                   Section List
// //                 </Button>
// //                 <Button
// //                   variant="outline"
// //                   onClick={() => setShowSchoolStudents(!showSchoolStudents)}
// //                 >
// //                   School List
// //                 </Button>
// //               </div>
// //             </CardHeader>
// //             <CardContent>
// //               {showSectionStudents && (
// //                 <div className="mb-6">
// //                   <h3 className="text-xl font-semibold mb-4">Section Students</h3>
// //                   <Table>
// //                     <TableHeader>
// //                       <TableRow>
// //                         <TableHead>Name</TableHead>
// //                         <TableHead>Email</TableHead>
// //                       </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                       {sectionStudents.map((student) => (
// //                         <TableRow key={student.id}>
// //                           <TableCell>{student.name}</TableCell>
// //                           <TableCell>{student.email}</TableCell>
// //                         </TableRow>
// //                       ))}
// //                     </TableBody>
// //                   </Table>
// //                 </div>
// //               )}

// //               {showSchoolStudents && (
// //                 <div>
// //                   <h3 className="text-xl font-semibold mb-4">School Students</h3>
// //                   <Table>
// //                     <TableHeader>
// //                       <TableRow>
// //                         <TableHead>Name</TableHead>
// //                         <TableHead>Email</TableHead>
// //                         <TableHead>Class</TableHead>
// //                       </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                       {schoolStudents.map((student) => (
// //                         <TableRow key={student.id}>
// //                           <TableCell>{student.name}</TableCell>
// //                           <TableCell>{student.email}</TableCell>
// //                           <TableCell>{student.class}</TableCell>
// //                         </TableRow>
// //                       ))}
// //                     </TableBody>
// //                   </Table>
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>
// //         </div>

// //         {/* Video Player Modal */}
// //         {selectedVideo && (
// //           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //             <div className="bg-white p-4 rounded-lg w-full max-w-4xl">
// //               <div className="flex justify-end mb-2">
// //                 <Button
// //                   variant="ghost"
// //                   size="icon"
// //                   onClick={() => setSelectedVideo(null)}
// //                 >
// //                   <X className="h-6 w-6" />
// //                 </Button>
// //               </div>
// //               <video
// //                 className="w-full"
// //                 controls
// //                 autoPlay
// //                 src={selectedVideo}
// //               >
// //                 Your browser does not support the video tag.
// //               </video>
// //             </div>
// //           </div>
// //         )}

// //         {/* Courses and Content */}
// //         <div className="grid md:grid-cols-2 gap-6">
// //           {/* Courses and Scenes */}
// //           <Card className="bg-white shadow-lg">
// //             <CardHeader>
// //               <CardTitle className="text-2xl">Courses & Scenes</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="space-y-6">
// //                 {courses.map((course) => (
// //                   <div key={course.id} className="border rounded-lg p-4">
// //                     <div 
// //                       className="flex justify-between items-center cursor-pointer"
// //                       onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
// //                     >
// //                       <h3 className="text-xl font-semibold">{course.name}</h3>
// //                       {expandedCourse === course.id ? 
// //                         <ChevronUp className="h-6 w-6" /> : 
// //                         <ChevronDown className="h-6 w-6" />
// //                       }
// //                     </div>
                    
// //                     {expandedCourse === course.id && (
// //                       <div className="mt-4 space-y-3">
// //                         {scenes
// //                           .filter(scene => scene.course_id === course.id)
// //                           .sort((a, b) => a.order - b.order)
// //                           .map(scene => (
// //                             <div
// //                               key={scene.id}
// //                               className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
// //                             >
// //                               <div className="flex items-center justify-between mb-2">
// //                                 <span className="text-lg font-medium">
// //                                   Scene {scene.order}: {scene.title}
// //                                 </span>
// //                                 <Button
// //                                   variant="outline"
// //                                   size="sm"
// //                                   onClick={() => setSelectedVideo(scene.video_url)}
// //                                 >
// //                                   <Video className="h-5 w-5 mr-2" />
// //                                   Play Video
// //                                 </Button>
// //                               </div>
// //                               <p className="text-gray-600">{scene.description}</p>
// //                             </div>
// //                           ))
// //                         }
// //                       </div>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Assignments */}
// //           <Card className="bg-white shadow-lg">
// //             <CardHeader>
// //             <CardTitle className="text-2xl">Assignments</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="space-y-6">
// //                 {courses.map((course) => {
// //                   const courseAssignments = assignments.filter(
// //                     assignment => assignment.course_id === course.id
// //                   );

// //                   if (courseAssignments.length === 0) return null;

// //                   return (
// //                     <div key={course.id} className="border rounded-lg p-4">
// //                       <h3 className="text-xl font-semibold mb-4">{course.name}</h3>
// //                       <div className="space-y-3">
// //                         {courseAssignments.map(assignment => (
// //                           <div
// //                             key={assignment.id}
// //                             className="p-3 bg-gray-50 rounded-lg"
// //                           >
// //                             <div className="flex items-center justify-between mb-2">
// //                               <span className="text-lg font-medium">
// //                                 {assignment.title}
// //                               </span>
// //                               <span className="text-sm text-gray-500">
// //                                 Due: {new Date(assignment.due_date).toLocaleDateString()}
// //                               </span>
// //                             </div>
// //                             <p className="text-gray-600">{assignment.description}</p>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </motion.div>
// //       {/* Button to open/close chatbot */}
// //       <Button onClick={toggleChatbot} className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition">
// //         <BotIcon className="w-8 h-8" />
      
// //       </Button>

// //       {/* Conditionally render the chatbot */}
// //       {showChatbot && <Chatbot />} {/* This will render the chatbot when showChatbot is true */}
// //     </div>
// //   );
// // };

// // export default TeacherDashboard;



"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Chatbot from "../../../components/ui/chatbot";
import { BotIcon, Edit, X, User, Mail, School, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

interface Teacher {
  id: string;
  name: string;
  email: string;
  class_assigned: string;
  school_admin_id: string;
  admin_id: string;
  class_id: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  school_admin_id: string;
}

interface Course {
  id: string;
  name: string;
  class_id: string;
  order: number;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  course_id: string;
}

interface StudentDetail {
  id: string;
  name: string;
  email: string;
  class: string;
  courses: Course[];
  assignments: Assignment[];
}

const TeacherDashboard = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [schoolName, setSchoolName] = useState<string>("");
  const [sectionStudents, setSectionStudents] = useState<Student[]>([]);
  const [schoolStudents, setSchoolStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showStudentDetailsModal, setShowStudentDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [editTeacherForm, setEditTeacherForm] = useState({
    name: "",
    email: "",
    class_assigned: ""
  });

  const supabase = createClient();
  
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  useEffect(() => {
    checkAuthAndFetchData();
    // Set light theme for body
    document.body.classList.add('bg-gray-100');
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');
      
      if (!token || !userData) {
        router.push('/login');
        return;
      }

      const parsedUserData = JSON.parse(userData);
      await fetchTeacherData(parsedUserData.email);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error loading dashboard data");
      router.push('/login');
    }
  };

  const fetchTeacherData = async (email: string) => {
    try {
      // Fetch teacher data
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('email', email)
        .single();

      if (teacherError) throw teacherError;
      setTeacherData(teacher);
      
      // Set initial edit form values
      setEditTeacherForm({
        name: teacher.name,
        email: teacher.email,
        class_assigned: teacher.class_assigned
      });

      // Fetch school name
      const { data: schoolData, error: schoolError } = await supabase
        .from('school_admins')
        .select('school_name')
        .eq('id', teacher.admin_id)
        .single();

      if (schoolError) {
        console.error('Error fetching school name:', schoolError);
      } else if (schoolData) {
        setSchoolName(schoolData.school_name);
      }

      // Fetch section students
      const { data: sectionStudentsData, error: sectionStudentsError } = await supabase
        .from('students')
        .select('*')
        .eq('class', teacher.class_assigned);

      if (sectionStudentsError) {
        console.error('Error fetching section students:', sectionStudentsError);
      } else if (sectionStudentsData) {
        setSectionStudents(sectionStudentsData);
      }

      // Fetch all school students
      const { data: schoolStudentsData, error: schoolStudentsError } = await supabase
        .from('students')
        .select('*')
        .eq('school_admin_id', teacher.admin_id);

      if (schoolStudentsError) {
        console.error('Error fetching school students:', schoolStudentsError);
      } else if (schoolStudentsData) {
        setSchoolStudents(schoolStudentsData);
      }

      // Fetch courses for the class
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('class_id', teacher.class_id)
        .order('order', { ascending: true });

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
      } else if (coursesData) {
        setCourses(coursesData);
      }

      // Fetch assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .order('due_date', { ascending: true });

      if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError);
      } else if (assignmentsData) {
        setAssignments(assignmentsData);
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error("Error fetching data");
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

  const getStudentStats = () => {
    return {
      sectionCount: sectionStudents.length,
      schoolCount: schoolStudents.length
    };
  };

  const viewStudentDetails = async (student: Student) => {
    try {
      // Get student's courses based on their class
      const studentCourses = courses.filter((course) => {
        // Find the matching course for the student's class
        return course.class_id === student.class;
      });

      // Get student's assignments based on enrolled courses
      const courseIds = studentCourses.map(course => course.id);
      const studentAssignments = assignments.filter(assignment => 
        courseIds.includes(assignment.course_id)
      );

      // Create detailed student object
      const studentDetail: StudentDetail = {
        ...student,
        courses: studentCourses,
        assignments: studentAssignments
      };

      setSelectedStudent(studentDetail);
      setShowStudentDetailsModal(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error fetching student details");
    }
  };

  const handleEditTeacher = () => {
    setShowEditTeacherModal(true);
  };

  const updateTeacherInfo = async () => {
    try {
      const { error } = await supabase
        .from('teachers')
        .update({
          name: editTeacherForm.name,
          email: editTeacherForm.email,
          class_assigned: editTeacherForm.class_assigned
        })
        .eq('id', teacherData?.id);

      if (error) throw error;

      // Update local state
      if (teacherData) {
        setTeacherData({
          ...teacherData,
          name: editTeacherForm.name,
          email: editTeacherForm.email,
          class_assigned: editTeacherForm.class_assigned
        });
      }

      setShowEditTeacherModal(false);
      toast.success("Teacher information updated successfully");
      
      // Refresh data
      if (teacherData) {
        await fetchTeacherData(editTeacherForm.email);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error updating teacher information");
    }
  };
      
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = getStudentStats();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Main Content Area */}
      <div className="p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900">
              {currentPage === "dashboard" && "Teacher Dashboard"}
              {currentPage === "courses" && "Course Summary"}
              {currentPage === "students" && "Student Management"}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-lg text-gray-600">
                {new Date().toLocaleDateString()}
              </div>
              
              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-red-100 hover:bg-red-200 border-red-300 text-red-700"
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Dashboard Content */}
          {currentPage === "dashboard" && (
            <>
              {/* Teacher Info Card */}
              <Card className="bg-white shadow-lg border-gray-200">
                <CardHeader className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                      <User className="h-8 w-8 text-blue-500" />
                      Teacher Information
                    </CardTitle>
                    <Button 
                      onClick={handleEditTeacher}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border-gray-300"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
                  <div className="space-y-4">
                    <p className="flex items-center gap-3 text-xl text-gray-700">
                      <User className="h-6 w-6" /> {teacherData?.name}
                    </p>
                    <p className="flex items-center gap-3 text-xl text-gray-700">
                      <Mail className="h-6 w-6" /> {teacherData?.email}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="flex items-center gap-3 text-xl text-gray-700">
                      <BookOpen className="h-6 w-6" /> Class: {teacherData?.class_assigned}
                    </p>
                    <p className="flex items-center gap-3 text-xl text-gray-700">
                      <School className="h-6 w-6" /> {schoolName || "School information not available"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics Cards */}
              <div className="grid md:grid-cols-1 gap-6">
                {/* Student Statistics Card */}
                <Card className="bg-white shadow-lg border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900">Student Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-100 rounded-lg">
                      <span className="text-lg font-medium">Class Students</span>
                      <span className="text-2xl font-bold text-blue-700">{stats.sectionCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-100 rounded-lg">
                      <span className="text-lg font-medium">School Students</span>
                      <span className="text-2xl font-bold text-green-700">{stats.schoolCount}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Assigned Students Card */}
                <Card className="bg-white shadow-lg border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900">Assigned Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200">
                          <TableHead className="text-gray-700">Name</TableHead>
                          <TableHead className="text-gray-700">Email</TableHead>
                          <TableHead className="text-gray-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sectionStudents.length > 0 ? (
                          sectionStudents.map((student) => (
                            <TableRow key={student.id} className="border-gray-200">
                              <TableCell className="text-gray-700">{student.name}</TableCell>
                              <TableCell className="text-gray-700">{student.email}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => viewStudentDetails(student)}
                                  className="bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-700"
                                >
                                  View More
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="border-gray-200">
                            <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                              No students assigned to your class
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Edit Teacher Modal */}
      {showEditTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Teacher Information</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditTeacherModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editTeacherForm.name}
                  onChange={(e) => setEditTeacherForm({...editTeacherForm, name: e.target.value})}
                  className="w-full p-2 border rounded-md bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editTeacherForm.email}
                  onChange={(e) => setEditTeacherForm({...editTeacherForm, email: e.target.value})}
                  className="w-full p-2 border rounded-md bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Assigned
                </label>
                <input
                  type="text"
                  value={editTeacherForm.class_assigned}
                  onChange={(e) => setEditTeacherForm({...editTeacherForm, class_assigned: e.target.value})}
                  className="w-full p-2 border rounded-md bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowEditTeacherModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 border-gray-300 text-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={updateTeacherInfo}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showStudentDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Student Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStudentDetailsModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-100 p-5 rounded-xl shadow-md">
                <h4 className="text-lg font-semibold mb-3 text-blue-600">Personal Information</h4>
                <p className="mb-2 text-gray-700">
                  <span className="font-medium text-gray-800">Name:</span> {selectedStudent.name}
                </p>
                <p className="mb-2 text-gray-700">
                  <span className="font-medium text-gray-800">Email:</span> {selectedStudent.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-gray-800">Class:</span> {selectedStudent.class}
                </p>
              </div>
              
              <div className="bg-gray-100 p-5 rounded-xl shadow-md">
                <h4 className="text-lg font-semibold mb-3 text-green-600">Enrollment Summary</h4>
                <p className="mb-2 text-gray-700">
                  <span className="font-medium text-gray-800">Courses Enrolled:</span> {selectedStudent.courses.length}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-gray-800">Total Assignments:</span> {selectedStudent.assignments.length}
                </p>
              </div>
            </div>
            
            {/* Enrolled Courses */}
            <div className="mb-6 bg-gray-100 p-5 rounded-xl shadow-md">
              <h4 className="text-lg font-semibold mb-3 text-purple-600">Enrolled Courses</h4>
              {selectedStudent.courses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700">Course Name</TableHead>
                      <TableHead className="text-gray-700">Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedStudent.courses.map((course) => (
                      <TableRow key={course.id} className="border-gray-200">
                        <TableCell className="text-gray-700">{course.name}</TableCell>
                        <TableCell className="text-gray-700">{course.order}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500">No courses enrolled</p>
              )}
            </div>
            
            {/* Assignments */}
            <div className="bg-gray-100 p-5 rounded-xl shadow-md">
              <h4 className="text-lg font-semibold mb-3 text-amber-600">Assignments</h4>
              {selectedStudent.assignments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700">Title</TableHead>
                      <TableHead className="text-gray-700">Description</TableHead>
                      <TableHead className="text-gray-700">Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedStudent.assignments.map((assignment) => (
                      <TableRow key={assignment.id} className="border-gray-200">
                        <TableCell className="text-gray-700">{assignment.title}</TableCell>
                        <TableCell className="text-gray-700">{assignment.description}</TableCell>
                        <TableCell className="text-gray-700">{new Date(assignment.due_date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500">No assignments available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Button */}
      <Button 
        onClick={toggleChatbot} 
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-full shadow-2xl transition-all hover:scale-110"
      >
        <BotIcon className="w-50 h-50" />
      </Button>

      {/* Conditionally render the chatbot */}
      {showChatbot && <Chatbot />}
    </div>
  );
};

export default TeacherDashboard;