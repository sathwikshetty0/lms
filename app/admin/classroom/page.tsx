// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { Class } from "@/utils/types";
// import {
//   Card,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// const supabase = createClient();

// export default function Dashboard() {
//   const [classes, setClasses] = useState<Class[]>([]); // Use the Class type for the state

//   useEffect(() => {
//     const fetchClasses = async () => {
//       const { data, error } = await supabase.from("classes").select("*");
//       if (data) setClasses(data as Class[]); // Cast the data to Class[]
//       if (error) console.error("Error fetching classes:", error);
//     };
//     fetchClasses();
//   }, []);

//   return (
//     <div className="flex flex-col gap-5 pb-20">
//       <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
//         Classroom
//       </h2>
//       <div className="grid gap-5">
//         {classes.map((cls) => (
//           <Link href={`/admin/classroom/${cls.id}`} key={cls.id}>
//             <Card className="hover:scale-[101%] transition-all duration-200">
//               <CardHeader>
//                 <CardTitle>{cls.name}</CardTitle>
//                 <CardDescription>{cls.description}</CardDescription>
//               </CardHeader>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }


// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { Class, Course } from "@/utils/types";
// import {
//   Card,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// const supabase = createClient();

// export default function Dashboard() {
//   const [classes, setClasses] = useState<Class[]>([]);
//   const [courses, setCourses] = useState<{ [key: string]: Course[] }>({});

//   useEffect(() => {
//     const fetchClasses = async () => {
//       const { data, error } = await supabase.from("classes").select("*");
//       if (data) {
//         setClasses(data as Class[]);
//         fetchCoursesForClasses(data as Class[]);
//       }
//       if (error) console.error("Error fetching classes:", error);
//     };

//     const fetchCoursesForClasses = async (classes: Class[]) => {
//       const newCourses: { [key: string]: Course[] } = {};
//       for (const cls of classes) {
//         const { data: courseData } = await supabase
//           .from("courses")
//           .select("*")
//           .eq("class_id", cls.id);
//         newCourses[cls.id] = courseData || [];
//       }
//       setCourses(newCourses);
//     };

//     fetchClasses();
//   }, []);

//   return (
//     <div className="flex flex-col gap-5 pb-20">
//       <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
//         Classroom
//       </h2>
//       <div className="grid gap-5">
//         {classes.map((cls) => (
//           <HoverCard key={cls.id}>
//             <HoverCardTrigger asChild>
//               <Link href={`/admin/classroom/${cls.id}`}>
//                 <Card className="hover:scale-[101%] transition-all duration-200 cursor-pointer">
//                   <CardHeader>
//                     <CardTitle>{cls.name}</CardTitle>
//                     <CardDescription>{cls.description}</CardDescription>
//                   </CardHeader>
//                 </Card>
//               </Link>
//             </HoverCardTrigger>
//             <HoverCardContent className="w-64 p-4 bg-white shadow-md rounded-lg">
//               <h3 className="text-lg font-semibold">
//                 Courses: {courses[cls.id]?.length || 0}
//               </h3>
//               <ul className="mt-2 text-sm text-gray-600">
//                 {courses[cls.id]?.length ? (
//                   courses[cls.id].map((course) => (
//                     <li key={course.id}>• {course.name}</li>
//                   ))
//                 ) : (
//                   <li>No courses available</li>
//                 )}
//               </ul>
//             </HoverCardContent>
//           </HoverCard>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Class, Course } from "@/utils/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const supabase = createClient();

export default function Dashboard() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<{ [key: string]: Course[] }>({});
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await supabase.from("classes").select("*");
      if (data) {
        setClasses(data as Class[]);
        fetchCoursesForClasses(data as Class[]);
      }
      if (error) console.error("Error fetching classes:", error);
    };

    const fetchCoursesForClasses = async (classes: Class[]) => {
      const newCourses: { [key: string]: Course[] } = {};
      for (const cls of classes) {
        const { data: courseData } = await supabase
          .from("courses")
          .select("*")
          .eq("class_id", cls.id);
        newCourses[cls.id] = courseData || [];
      }
      setCourses(newCourses);
    };

    fetchClasses();
  }, []);

  const handleMouseMove = (e: React.MouseEvent, classId: string) => {
    const offsetX = -950; // Keeps it close to the cursor
    const offsetY = -210;

    // Prevent it from going off the screen
    const maxX = window.innerWidth - 200; // Card width approx
    const maxY = window.innerHeight - 100; // Card height approx

    setHoverPosition({
      x: Math.min(e.clientX + offsetX, maxX),
      y: Math.min(e.clientY + offsetY, maxY),
    });

    setHoveredClass(classId);
  };

  return (
    <div className="flex flex-col gap-5 pb-20">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        Classroom
      </h2>
      <div className="grid gap-5">
        {classes.map((cls) => (
          <HoverCard key={cls.id} open={hoveredClass === cls.id}>
            <HoverCardTrigger asChild>
              <Link href={`/admin/classroom/${cls.id}`}>
                <Card
                  className="hover:scale-[101%] transition-all duration-200 cursor-pointer"
                  onMouseMove={(e) => handleMouseMove(e, cls.id)}
                  onMouseEnter={() => setHoveredClass(cls.id)}
                  onMouseLeave={() => setHoveredClass(null)}
                >
                  <CardHeader>
                    <CardTitle>{cls.name}</CardTitle>
                    <CardDescription>{cls.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </HoverCardTrigger>

            {hoveredClass === cls.id && (
              <HoverCardContent
                className="w-64 p-4 bg-white shadow-lg rounded-lg fixed z-50"
                style={{
                  top: `${hoverPosition.y}px`,
                  left: `${hoverPosition.x}px`,
                  transform: "translate(-50%, -50%)", // Centers it on the cursor
                }}
              >
                <h3 className="text-lg font-semibold">
                  Courses: {courses[cls.id]?.length || 0}
                </h3>
                <ul className="mt-2 text-sm text-gray-600">
                  {courses[cls.id]?.length ? (
                    courses[cls.id].map((course) => (
                      <li key={course.id}>• {course.name}</li>
                    ))
                  ) : (
                    <li>No courses available</li>
                  )}
                </ul>
              </HoverCardContent>
            )}
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
