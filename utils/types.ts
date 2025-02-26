// Class Type
export type Class = {
  id: string;
  name: string;
  description?: string;
};

// Course Type
export type Course = {
  id: string;
  class_id: string;
  name: string;
  content_order: string[];
};

// Scene Type
export type Scene = {
  id: string;
  course_id: string;
  name: string;
  description?: string;
  video_url?: string;
};

// Assignment Type
export type Assignment = {
  id: string;
  course_id: string;
  name: string;
  description?: string;
  max_score?: number;
};

// Dashboard Props
export type DashboardProps = {
  classes: Class[];
};

// Class Page Props
export type ClassPageProps = {
  courses: Course[];
};

// Course Page Props
export type CoursePageProps = {
  scenes: Scene[];
  assignments: Assignment[];
};

// Scene Page Props
export type ScenePageProps = {
  scene: Scene;
  nextSceneId?: string;
};
