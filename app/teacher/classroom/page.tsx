// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";
// import Link from "next/link";
// import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// const supabase = createClient();

// export default function TeacherClassroomPage() {
//   const [classData, setClassData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTeacherClass = async () => {
//       const token = localStorage.getItem("access_token");
//       const userData = localStorage.getItem("user_data");
//       if (!token || !userData) return;
//       const teacher = JSON.parse(userData);
//       // Use the correct property name—adjust as needed:
//       const classId = teacher.class_assigned || teacher.class_id;
//       if (!classId) {
//         setLoading(false);
//         return;
//       }
//       const { data, error } = await supabase
//         .from("classes")
//         .select("*")
//         .eq("id", classId)
//         .single();
//       if (data) {
//         setClassData(data);
//       } else {
//         console.error("Error fetching class data:", error);
//       }
//       setLoading(false);
//     };
//     fetchTeacherClass();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (!classData) return <div>No class assigned.</div>;

//   return (
//     <div className="flex flex-col gap-5 pb-20">
//       <h2 className="text-2xl font-bold py-3">My Classroom</h2>
//       <Link href={`/teacher/classroom/${classData.id}`}>
//         <Card className="hover:scale-105 transition-transform duration-200 cursor-pointer">
//           <CardHeader>
//             <CardTitle>{classData.name}</CardTitle>
//             <CardDescription>{classData.description}</CardDescription>
//           </CardHeader>
//         </Card>
//       </Link>
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
