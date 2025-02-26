"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { SkeletonCardList } from "@/components/SkeletonCard";

const SchoolAdminDashboard = () => {
  const [schoolAdmins, setSchoolAdmins] = useState<
    { id: string; school_name: string; classes: string[]; email: string }[]
  >([]);
  const [schoolName, setSchoolName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchSchoolAdmins = async () => {
      const { data, error } = await supabase
        .from("school_admins")
        .select("id, school_name, classes, auth_id");

      if (error) {
        console.error("Failed to fetch school admins:", error);
        setLoading(false);
      } else {
        const formattedData = await Promise.all(
          data?.map(async (admin) => {
            const { data: authData, error: authError } = await supabase
              .from("school_admin_auth")
              .select("email")
              .eq("id", admin.auth_id)
              .single();

            if (authError || !authData) {
              console.error("Failed to fetch email for admin", admin.id);
              return null;
            }

            return {
              id: admin.id,
              school_name: admin.school_name,
              classes: admin.classes,
              email: authData.email,
            };
          }) || []
        );

        setSchoolAdmins(formattedData.filter(Boolean) as any);
      }
    };

    fetchSchoolAdmins();

    const token = localStorage.getItem("access_token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const email = decodedToken.email;

      const matchedAdmin = schoolAdmins.find((admin) => admin.email === email);
      if (matchedAdmin) {
        setSchoolName(matchedAdmin.school_name);
      }
    }
  }, [supabase, schoolAdmins]);

  useEffect(() => {
    if (schoolAdmins.length > 0) {
      setLoading(false);
    }
  }, [schoolAdmins]);

  return (
    <div className="flex flex-col gap-5 pb-20">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        School Admin Dashboard
      </h2>
      <SkeletonCardList />
    </div>
  );
};

export default SchoolAdminDashboard;
