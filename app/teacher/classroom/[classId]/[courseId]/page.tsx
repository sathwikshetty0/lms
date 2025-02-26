"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Scene, Assignment } from "@/utils/types";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const supabase = createClient();

export default function TeacherCoursePage() {
  const params = useParams();
  const { classId, courseId } = params;
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [scenesData, assignmentsData] = await Promise.all([
        supabase.from("scenes").select("*").eq("course_id", courseId),
        supabase.from("assignments").select("*").eq("course_id", courseId),
      ]);
      if (scenesData.data) setScenes(scenesData.data as Scene[]);
      if (assignmentsData.data) setAssignments(assignmentsData.data as Assignment[]);
    };
    fetchData();
  }, [courseId]);

  return (
    <div className="flex flex-col gap-5 pb-20">
      <h2 className="text-2xl font-bold py-3">Course Content</h2>

      {/* Scenes Section */}
      <h3 className="text-xl font-bold py-3">Scenes</h3>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
        {scenes.map((scene) => (
          <HoverCard key={scene.id}>
            <HoverCardTrigger asChild>
              <Link href={`/teacher/classroom/${classId}/${courseId}/${scene.id}`}>
                <Card className="hover:scale-105 transition-transform duration-200 cursor-pointer bg-green-500/10">
                  <CardHeader>
                    <CardTitle>{scene.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-4 bg-white shadow-md rounded-lg">
              <h3 className="text-sm font-semibold">Scene Details</h3>
              <p className="text-lg text-gray-900">{scene.description}</p>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      {/* Assignments Section */}
      <h3 className="text-xl font-bold py-3">Assignments</h3>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
        {assignments.map((assignment) => (
          <HoverCard key={assignment.id}>
            <HoverCardTrigger asChild>
              <Card className="hover:scale-105 transition-transform duration-200 cursor-pointer bg-red-500/10">
                <CardHeader>
                  <CardTitle>{assignment.name}</CardTitle>
                </CardHeader>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-4 bg-white shadow-md rounded-lg">
              <h3 className="text-sm font-semibold">Assignment Details</h3>
              <p className="text-lg text-gray-900">{assignment.description}</p>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
