"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Scene } from "@/utils/types";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";

const supabase = createClient();

export default function TeacherScenePage() {
  const params = useParams();
  const { classId, courseId, sceneId } = params;
  const [scene, setScene] = useState<Scene | null>(null);
  const [nextScene, setNextScene] = useState<Scene | null>(null);
  const [prevScene, setPrevScene] = useState<Scene | null>(null);
  const [otherScenes, setOtherScenes] = useState<Scene[]>([]);

  useEffect(() => {
    const fetchScene = async () => {
      // Fetch current scene
      const { data: currentScene, error: sceneError } = await supabase
        .from("scenes")
        .select("*")
        .eq("id", sceneId)
        .single();
      if (sceneError) {
        console.error("Error fetching current scene:", sceneError);
        return;
      }
      setScene(currentScene as Scene);

      // Fetch all scenes in the course
      const { data: allScenes, error: allScenesError } = await supabase
        .from("scenes")
        .select("*")
        .eq("course_id", courseId);
      if (allScenesError) {
        console.error("Error fetching all scenes:", allScenesError);
        return;
      }
      if (allScenes) {
        const currentIndex = allScenes.findIndex((s) => s.id === sceneId);
        if (currentIndex >= 0) {
          setNextScene(currentIndex < allScenes.length - 1 ? allScenes[currentIndex + 1] as Scene : null);
          setPrevScene(currentIndex > 0 ? allScenes[currentIndex - 1] as Scene : null);
        }
        const otherScenesData = allScenes.filter((s) => s.id !== sceneId);
        setOtherScenes(otherScenesData as Scene[]);
      }
    };

    fetchScene();
  }, [courseId, sceneId]);

  return (
    <div className="flex gap-5 xl:flex-row flex-col">
      {/* Left Side – Scene Content */}
      <div className="w-full xl:pb-20">
        <h2 className="text-2xl font-bold py-3">{scene?.name || "Scene"}</h2>
        {!scene?.name && <Skeleton className="w-80 h-16" />}
        <p className="text-xl font-semibold py-5">{scene?.description}</p>
        {scene?.video_url ? (
          <div className="relative">
            <HeroVideoDialog
              className="block"
              animationStyle="from-center"
              videoSrc={scene.video_url}
              thumbnailSrc="https://example.com/thumbnail.jpg"
              thumbnailAlt={scene.name}
            />
          </div>
        ) : (
          <Skeleton className="w-full aspect-video" />
        )}
        <div className="my-5 flex w-full justify-between">
          {prevScene ? (
            <Link href={`/teacher/classroom/${classId}/${courseId}/${prevScene.id}`}>
              <Button>Previous</Button>
            </Link>
          ) : (
            <Button disabled>Previous</Button>
          )}
          {nextScene ? (
            <Link href={`/teacher/classroom/${classId}/${courseId}/${nextScene.id}`}>
              <Button>Next</Button>
            </Link>
          ) : (
            <Button disabled>Next</Button>
          )}
        </div>
      </div>

      {/* Right Side – Next Scene & Other Scenes */}
      <div className="flex-col xl:p-5 py-5 xl:border-l gap-5 pb-20 xl:max-w-xs w-full">
        <h2 className="text-xl font-semibold pb-5">Next Scene</h2>
        <div className="flex flex-col gap-5">
          {nextScene ? (
            <Link href={`/teacher/classroom/${classId}/${courseId}/${nextScene.id}`}>
              <Card className="bg-green-500/20 border-0">
                <CardHeader>
                  <CardTitle>{nextScene.name}</CardTitle>
                  <CardDescription>{nextScene.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ) : (
            <Skeleton className="w-full h-20" />
          )}
        </div>
        <h2 className="text-xl font-semibold py-5">Other Scenes</h2>
        <div className="flex flex-col gap-5">
          {otherScenes.map((otherScene) => (
            <Link key={otherScene.id} href={`/teacher/classroom/${classId}/${courseId}/${otherScene.id}`}>
              <Card className="bg-blue-500/20 border-0">
                <CardHeader>
                  <CardTitle>{otherScene.name}</CardTitle>
                  <CardDescription>{otherScene.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
          {!otherScenes && <Skeleton className="w-full h-20" />}
        </div>
      </div>
    </div>
  );
}
