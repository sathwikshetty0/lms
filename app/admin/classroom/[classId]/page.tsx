
// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { Course, Class } from "@/utils/types"; // Import the Class type
// import { useParams } from "next/navigation";
// import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// const supabase = createClient();

// export default function ClassPage() {
//   const params = useParams();
//   const { classId } = params;
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [classData, setClassData] = useState<Class | null>(null); // State to store class info

//   useEffect(() => {
//     const fetchData = async () => {
//       // Fetch the class info
//       const { data: classData, error: classError } = await supabase
//         .from("classes")
//         .select("*")
//         .eq("id", classId)
//         .single(); // Fetch only one class

//       if (classData) {
//         setClassData(classData as Class); // Store class data
//       }
//       if (classError) {
//         console.error("Error fetching class data:", classError);
//       }

//       // Fetch courses for the class
//       const { data: coursesData, error: coursesError } = await supabase
//         .from("courses")
//         .select("*")
//         .eq("class_id", classId);

//       if (coursesData) {
//         setCourses(coursesData as Course[]);
//       }
//       if (coursesError) {
//         console.error("Error fetching courses:", coursesError);
//       }
//     };

//     fetchData();
//   }, [classId]);

//   return (
//     <div className="flex flex-col gap-5 pb-20">
//       {classData ? (
//         <>
//           <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
//             {classData.name}
//           </h2>
//         </>
//       ) : (
//         <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
//           Class
//         </h2>
//       )}
//       <div className="grid gap-5">
//         {courses.map((course) => (
//           <Link
//             href={`/admin/classroom/${classId}/${course.id}`}
//             key={course.id}
//           >
//             <Card className="hover:scale-[101%] transition-all duration-200">
//               <CardHeader>
//                 <CardTitle>{course.name}</CardTitle>
//               </CardHeader>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Course, Class } from "@/utils/types"; // Import additional types
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const supabase = createClient();

export default function ClassPage() {
  const params = useParams();
  const { classId } = params;
  const [courses, setCourses] = useState<Course[]>([]);
  const [classData, setClassData] = useState<Class | null>(null);
  const [courseDetails, setCourseDetails] = useState<{ [key: string]: { scenes: number; assignments: number } }>({});
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Class Info
      const { data: classData, error: classError } = await supabase
        .from("classes")
        .select("*")
        .eq("id", classId)
        .single();

      if (classData) setClassData(classData as Class);
      if (classError) console.error("Error fetching class data:", classError);

      // Fetch Courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .eq("class_id", classId);

      if (coursesData) {
        setCourses(coursesData as Course[]);
        fetchCourseDetails(coursesData as Course[]);
      }
      if (coursesError) console.error("Error fetching courses:", coursesError);
    };

    const fetchCourseDetails = async (courses: Course[]) => {
      let details: { [key: string]: { scenes: number; assignments: number } } = {};

      for (const course of courses) {
        // Fetch Scenes Count
        const { count: scenesCount } = await supabase
          .from("scenes")
          .select("*", { count: "exact" })
          .eq("course_id", course.id);

        // Fetch Assignments Count
        const { count: assignmentsCount } = await supabase
          .from("assignments")
          .select("*", { count: "exact" })
          .eq("course_id", course.id);

        details[course.id] = {
          scenes: scenesCount || 0,
          assignments: assignmentsCount || 0,
        };
      }

      setCourseDetails(details);
    };

    fetchData();
  }, [classId]);

  const handleMouseMove = (e: React.MouseEvent, courseId: string) => {
    const offsetX = -950; // Keeps it close to the cursor
    const offsetY = -170;

    // Prevent the hover card from going off-screen
    const maxX = window.innerWidth - 220; // Approximate card width
    const maxY = window.innerHeight - 120; // Approximate card height

    setHoverPosition({
      x: Math.min(e.clientX + offsetX, maxX),
      y: Math.min(e.clientY + offsetY, maxY),
    });

    setHoveredCourse(courseId);
  };

  return (
    <div className="flex flex-col gap-5 pb-20">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        {classData?.name || "Class"}
      </h2>

      <div className="grid gap-5">
        {courses.map((course) => (
          <HoverCard key={course.id} open={hoveredCourse === course.id}>
            <HoverCardTrigger asChild>
              <Link href={`/admin/classroom/${classId}/${course.id}`}>
                <Card
                  className="hover:scale-[101%] transition-all duration-200 cursor-pointer"
                  onMouseMove={(e) => handleMouseMove(e, course.id)}
                  onMouseEnter={() => setHoveredCourse(course.id)}
                  onMouseLeave={() => setHoveredCourse(null)}
                >
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </HoverCardTrigger>

            {hoveredCourse === course.id && (
              <HoverCardContent
                className="w-64 p-4 bg-white shadow-lg rounded-lg fixed z-50"
                style={{
                  top: `${hoverPosition.y}px`,
                  left: `${hoverPosition.x}px`,
                  transform: "translate(-50%, -50%)", // Centers it on the cursor
                }}
              >
                <h3 className="text-lg font-semibold">Course Details</h3>
                <p className="text-sm text-gray-600">📜 Scenes: {courseDetails[course.id]?.scenes || 0}</p>
                <p className="text-sm text-gray-600">📝 Assignments: {courseDetails[course.id]?.assignments || 0}</p>
              </HoverCardContent>
            )}
          </HoverCard>
        ))}
      </div>
    </div>
  );
}


//image wala

// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { Course, Class } from "@/utils/types"; // Import additional types
// import { useParams } from "next/navigation";
// import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// const supabase = createClient();

// export default function ClassPage() {
//   const params = useParams();
//   const { classId } = params;
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [classData, setClassData] = useState<Class | null>(null);
//   const [courseDetails, setCourseDetails] = useState<{ [key: string]: { scenes: number; assignments: number } }>({});
//   const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
//   const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       // Fetch Class Info
//       const { data: classData, error: classError } = await supabase
//         .from("classes")
//         .select("*")
//         .eq("id", classId)
//         .single();

//       if (classData) setClassData(classData as Class);
//       if (classError) console.error("Error fetching class data:", classError);

//       // Fetch Courses
//       const { data: coursesData, error: coursesError } = await supabase
//         .from("courses")
//         .select("*")
//         .eq("class_id", classId);

//       if (coursesData) {
//         setCourses(coursesData as Course[]);
//         fetchCourseDetails(coursesData as Course[]);
//       }
//       if (coursesError) console.error("Error fetching courses:", coursesError);
//     };

//     const fetchCourseDetails = async (courses: Course[]) => {
//       let details: { [key: string]: { scenes: number; assignments: number } } = {};

//       for (const course of courses) {
//         // Fetch Scenes Count
//         const { count: scenesCount } = await supabase
//           .from("scenes")
//           .select("*", { count: "exact" })
//           .eq("course_id", course.id);

//         // Fetch Assignments Count
//         const { count: assignmentsCount } = await supabase
//           .from("assignments")
//           .select("*", { count: "exact" })
//           .eq("course_id", course.id);

//         details[course.id] = {
//           scenes: scenesCount || 0,
//           assignments: assignmentsCount || 0,
//         };
//       }

//       setCourseDetails(details);
//     };

//     fetchData();
//   }, [classId]);

//   const handleMouseMove = (e: React.MouseEvent, courseId: string) => {
//     const offsetX = -950; // Keeps it close to the cursor
//     const offsetY = -170;

//     // Prevent the hover card from going off-screen
//     const maxX = window.innerWidth - 220; // Approximate card width
//     const maxY = window.innerHeight - 120; // Approximate card height

//     setHoverPosition({
//       x: Math.min(e.clientX + offsetX, maxX),
//       y: Math.min(e.clientY + offsetY, maxY),
//     });

//     setHoveredCourse(courseId);
//   };

//   return (
//     <div className="flex flex-col gap-5 pb-20">
//       <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
//         {classData?.name || "Class"}
//       </h2>

//       <div className="grid gap-5">
//         {courses.map((course) => (
//           <HoverCard key={course.id} open={hoveredCourse === course.id}>
//             <HoverCardTrigger asChild>
//               <Link href={`/admin/classroom/${classId}/${course.id}`}>
//                 <Card
//                   className="hover:scale-[101%] transition-all duration-200 cursor-pointer"
//                   onMouseMove={(e) => handleMouseMove(e, course.id)}
//                   onMouseEnter={() => setHoveredCourse(course.id)}
//                   onMouseLeave={() => setHoveredCourse(null)}
//                 >
//                   <CardHeader>
//                     <CardTitle>{course.name}</CardTitle>
//                   </CardHeader>
//                 </Card>
//               </Link>
//             </HoverCardTrigger>

//             {hoveredCourse === course.id && (
//               <HoverCardContent
//                 className="w-64 p-4 bg-white shadow-lg rounded-lg fixed z-50"
//                 style={{
//                   top: `${hoverPosition.y}px`,
//                   left: `${hoverPosition.x}px`,
//                   transform: "translate(-50%, -50%)", // Centers it on the cursor
//                 }}
//               >
//                 <h3 className="text-lg font-semibold">Course Details</h3>
//                 <p className="text-sm text-gray-600">📜 Scenes: {courseDetails[course.id]?.scenes || 0}</p>
//                 <p className="text-sm text-gray-600">📝 Assignments: {courseDetails[course.id]?.assignments || 0}</p>
//               </HoverCardContent>
//             )}
//           </HoverCard>
//         ))}
//       </div>
//     </div>
//   );
// }


// mid hover


// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { Course, Class } from "@/utils/types";
// import { useParams } from "next/navigation";
// import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// const supabase = createClient();

// export default function ClassPage() {
//   const params = useParams();
//   const { classId } = params;
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [classData, setClassData] = useState<Class | null>(null);
//   const [courseDetails, setCourseDetails] = useState<{ [key: string]: { scenes: number; assignments: number } }>({});
//   const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
//   const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       // Fetch Class Info
//       const { data: classData, error: classError } = await supabase
//         .from("classes")
//         .select("*")
//         .eq("id", classId)
//         .single();

//       if (classData) setClassData(classData as Class);
//       if (classError) console.error("Error fetching class data:", classError);

//       // Fetch Courses
//       const { data: coursesData, error: coursesError } = await supabase
//         .from("courses")
//         .select("*")
//         .eq("class_id", classId);

//       if (coursesData) {
//         setCourses(coursesData as Course[]);
//         fetchCourseDetails(coursesData as Course[]);
//       }
//       if (coursesError) console.error("Error fetching courses:", coursesError);
//     };

//     const fetchCourseDetails = async (courses: Course[]) => {
//       let details: { [key: string]: { scenes: number; assignments: number } } = {};

//       for (const course of courses) {
//         // Fetch Scenes Count
//         const { count: scenesCount } = await supabase
//           .from("scenes")
//           .select("*", { count: "exact" })
//           .eq("course_id", course.id);

//         // Fetch Assignments Count
//         const { count: assignmentsCount } = await supabase
//           .from("assignments")
//           .select("*", { count: "exact" })
//           .eq("course_id", course.id);

//         details[course.id] = {
//           scenes: scenesCount || 0,
//           assignments: assignmentsCount || 0,
//         };
//       }

//       setCourseDetails(details);
//     };

//     fetchData();
//   }, [classId]);

//   const handleMouseMove = (e: React.MouseEvent, courseId: string) => {
//     const offsetX = -950; // Keeps it close to the cursor
//     const offsetY = -170;

//     // Prevent the hover card from going off-screen
//     const maxX = window.innerWidth - 220; // Approximate card width
//     const maxY = window.innerHeight - 120; // Approximate card height

//     setHoverPosition({
//       x: Math.min(e.clientX + offsetX, maxX),
//       y: Math.min(e.clientY + offsetY, maxY),
//     });

//     setHoveredCourse(courseId);
//   };

//   return (
//     <div className="flex flex-col gap-5 pb-20">
//       <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
//         {classData?.name || "Class"}
//       </h2>

//       <div className="grid gap-5">
//         {courses.map((course) => (
//           <HoverCard key={course.id} open={hoveredCourse === course.id}>
//             <HoverCardTrigger asChild>
//               <Link href={`/admin/classroom/${classId}/${course.id}`}>
//                 <Card
//                   className="hover:scale-[101%] transition-all duration-200 cursor-pointer"
//                   onMouseMove={(e) => handleMouseMove(e, course.id)}
//                   onMouseEnter={() => setHoveredCourse(course.id)}
//                   onMouseLeave={() => setHoveredCourse(null)}
//                 >
//                   <CardHeader className="relative">
//                       {course?.cover_image && (
//                         <img
//                           src={course?.cover_image}
//                           alt={course.name}
//                           className="w-full h-32 object-cover rounded-lg"
//                         />
//                       )}
//                     <CardTitle className="mt-2">{course.name}</CardTitle>
//                   </CardHeader>
//                 </Card>
//               </Link>
//             </HoverCardTrigger>

//             {hoveredCourse === course.id && (
//               <HoverCardContent
//                 className="w-64 p-4 bg-white shadow-lg rounded-lg fixed z-50"
//                 style={{
//                   top: `${hoverPosition.y}px`,
//                   left: `${hoverPosition.x}px`,
//                   transform: "translate(-50%, -50%)", // Centers it on the cursor
//                 }}
//               >
//                 <h3 className="text-lg font-semibold">Course Details</h3>
//                 <p className="text-sm text-gray-600">📜 Scenes: {courseDetails[course.id]?.scenes || 0}</p>
//                 <p className="text-sm text-gray-600">📝 Assignments: {courseDetails[course.id]?.assignments || 0}</p>
//               </HoverCardContent>
//             )}
//           </HoverCard>
//         ))}
//       </div>
//     </div>
//   );
// }
