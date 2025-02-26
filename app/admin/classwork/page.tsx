"use client";

import { Class, Course, Scene, Assignment } from "@/utils/types";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Input_03 from "@/components/kokonutui/input-03";
import { toast } from "sonner";

const supabase = createClient();

export default function Classwork() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [newClass, setNewClass] = useState({ name: "", description: "" });
  const [newCourse, setNewCourse] = useState({
    class_id: "",
    name: "",
    content_order: [] as string[],
  });
  const [newScene, setNewScene] = useState({
    course_id: "",
    name: "",
    description: "",
    video_url: "",
  });
  const [newAssignment, setNewAssignment] = useState({
    course_id: "",
    name: "",
    description: "",
    max_score: 0,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const classNameRef = useRef<HTMLInputElement>(null);
  const courseNameRef = useRef<HTMLInputElement>(null);
  const sceneNameRef = useRef<HTMLInputElement>(null);
  const assignmentNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [classesData, coursesData, scenesData, assignmentsData] =
      await Promise.all([
        supabase.from("classes").select("*"),
        supabase.from("courses").select("*"),
        supabase.from("scenes").select("*"),
        supabase.from("assignments").select("*"),
      ]);

    if (classesData.data) setClasses(classesData.data);
    if (coursesData.data) setCourses(coursesData.data);
    if (scenesData.data) setScenes(scenesData.data);
    if (assignmentsData.data) setAssignments(assignmentsData.data);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    nextRef: React.RefObject<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus(); // Move focus to the next input field
    }
  };

  const createClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("classes")
      .insert(newClass)
      .select();

    if (data) {
      setClasses([...classes, data[0]]);
      setNewClass({ name: "", description: "" });
      toast.success("Class created successfully!");
    }
    if (error) {
      console.error("Class creation error:", error);
    }
    setLoading(false);
  };

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .insert(newCourse)
      .select();

    if (data) {
      setCourses([...courses, data[0]]);
      setNewCourse({ class_id: "", name: "", content_order: [] });
      toast.success("Course created successfully!");
    }
    if (error) {
      console.error("Course creation error:", error);
    }
    setLoading(false);
  };

  const createScene = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let videoUrl = "";
    if (videoFile) {
      const fileName = `scene_${Date.now()}_${videoFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, videoFile);

      if (uploadError) {
        console.error("Video upload error:", uploadError);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("videos")
        .getPublicUrl(fileName);

      videoUrl = urlData.publicUrl;
    }

    const sceneData = { ...newScene, video_url: videoUrl };
    const { data, error } = await supabase
      .from("scenes")
      .insert(sceneData)
      .select();

    if (data) {
      setScenes([...scenes, data[0]]);
      setNewScene({ course_id: "", name: "", description: "", video_url: "" });
      toast.success("Scene created successfully!");
    }
    if (error) {
      console.error("Scene creation error:", error);
    }
    setLoading(false);
  };

  const createAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("assignments")
      .insert(newAssignment)
      .select();

    if (data) {
      setAssignments([...assignments, data[0]]);
      setNewAssignment({
        course_id: "",
        name: "",
        description: "",
        max_score: 0,
      });
      toast.success("Assignment created successfully!");
    }
    if (error) {
      console.error("Assignment creation error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 pb-20">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        Classwork
      </h2>
      <div className="grid gap-5 md:grid-cols-2 grid-cols-1">
        {/* Class Form */}
        <form onSubmit={createClass}>
          <Card>
            <CardHeader>
              <CardTitle>Add New Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-5">
                <Input
                  ref={classNameRef}
                  type="text"
                  placeholder="Class Name"
                  value={newClass.name}
                  onChange={(e) =>
                    setNewClass({ ...newClass, name: e.target.value })
                  }
                  required
                />
                <Textarea
                  required
                  placeholder="Class Description"
                  value={newClass.description}
                  onChange={(e) =>
                    setNewClass({ ...newClass, description: e.target.value })
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Add New Class"}
              </Button>
            </CardFooter>
          </Card>
        </form>
        {/* Course Form */}
        <form onSubmit={createCourse}>
          <Card>
            <CardHeader>
              <CardTitle>Create Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-5">
                <Select
                  required
                  value={newCourse.class_id}
                  onValueChange={(value) =>
                    setNewCourse({ ...newCourse, class_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  ref={courseNameRef}
                  type="text"
                  placeholder="Course Name"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Course"}
              </Button>
            </CardFooter>
          </Card>{" "}
        </form>
        {/* Scene Form */}
        <form onSubmit={createScene}>
          <Card>
            <CardHeader>
              <CardTitle>Add Scene</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-5">
                <Select
                  required
                  value={newScene.course_id}
                  onValueChange={(value) =>
                    setNewScene({ ...newScene, course_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  ref={sceneNameRef}
                  type="text"
                  placeholder="Scene Name"
                  value={newScene.name}
                  onChange={(e) =>
                    setNewScene({ ...newScene, name: e.target.value })
                  }
                  required
                />
                <Textarea
                  required
                  placeholder="Scene Description"
                  value={newScene.description}
                  onChange={(e) =>
                    setNewScene({ ...newScene, description: e.target.value })
                  }
                />
                <Input_03
                  id="video"
                  label="Upload video file"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Scene"}
              </Button>
            </CardFooter>
          </Card>{" "}
        </form>
        {/* Assignment Form */}
        <form onSubmit={createAssignment}>
          <Card>
            <CardHeader>
              <CardTitle>Create Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-5">
                <Select
                  required
                  value={newAssignment.course_id}
                  onValueChange={(value) =>
                    setNewAssignment({ ...newAssignment, course_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  ref={assignmentNameRef}
                  type="text"
                  placeholder="Assignment Name"
                  value={newAssignment.name}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, name: e.target.value })
                  }
                  required
                />
                <Textarea
                  required
                  placeholder="Assignment Description"
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      description: e.target.value,
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max Score"
                  value={newAssignment.max_score}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      max_score: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Assignment"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
