import { createClient } from "@supabase/supabase-js";
import { Class, Course, Scene, Activity } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadVideoToSupabase(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `videos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("videos")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("videos").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createClass(classData: Class) {
  return await supabase.from("classes").insert(classData).select();
}

export async function createCourse(courseData: Course) {
  return await supabase.from("courses").insert(courseData).select();
}

export async function createScene(sceneData: Scene) {
  return await supabase.from("scenes").insert(sceneData).select();
}

export async function fetchClasses() {
  return await supabase.from("classes").select("*");
}

export async function fetchCoursesByClass(classId: number) {
  return await supabase.from("courses").select("*").eq("class_id", classId);
}

export async function fetchScenesByCourse(sceneIds: number[]) {
  return await supabase.from("scenes").select("*").in("id", sceneIds);
}
