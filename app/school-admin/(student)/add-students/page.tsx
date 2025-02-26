"use client";

import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import Papa from "papaparse";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Input_03 from "@/components/kokonutui/input-03";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonCardList } from "@/components/SkeletonCard";

type Student = {
  name: string;
  email: string;
  age: string;
  class: string;
  school_admin_id: string;
};

const AddStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [schoolAdmins, setSchoolAdmins] = useState<
    { id: string; school_name: string; classes: string[]; email: string }[]
  >([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [classOptions, setClassOptions] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
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
        setSelectedAdminId(matchedAdmin.id);
        setSchoolName(matchedAdmin.school_name);
        setClassOptions(matchedAdmin.classes || []);
      }
    }
  }, [supabase, schoolAdmins]);

  useEffect(() => {
    if (schoolAdmins.length > 0) {
      setLoading(false);
    }
  }, [schoolAdmins]);

  const handleAdminChange = (adminId: string) => {
    setSelectedAdminId(adminId);

    const selectedAdmin = schoolAdmins.find((admin) => admin.id === adminId);
    setClassOptions(selectedAdmin?.classes || []);
  };

  const handleInputChange = (
    index: number,
    field: keyof Student,
    value: string
  ) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const addRow = () => {
    if (!selectedAdminId || !selectedClass) {
      toast.warning(
        "Please select a school admin and class before adding rows."
      );
      return;
    }
    setStudents([
      ...students,
      {
        name: "",
        email: "",
        age: "",
        class: selectedClass,
        school_admin_id: selectedAdminId,
      },
    ]);
  };

  const removeRow = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAdminId || !selectedClass) {
      toast.warning(
        "Please select a school admin and class before uploading a CSV."
      );
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          toast.error("Error parsing CSV file. Please check the file format.");
        } else {
          const parsedData: Student[] = result.data.map((row: any) => ({
            name: row.name || "",
            email: row.email || "",
            age: row.age || 0,
            class: selectedClass,
            school_admin_id: selectedAdminId,
          }));
          setStudents((prev) => [...prev, ...parsedData]);
        }
      },
    });
  };

  const handleSubmit = async () => {
    if (students.length === 0) {
      toast.warning("No students to submit. Please upload a CSV or add rows.");
      return;
    }

    if (
      students.some(
        (student) =>
          !student.name ||
          !student.email ||
          !student.age ||
          !student.class ||
          !student.school_admin_id
      )
    ) {
      toast.warning("All fields are required for every student.");
      return;
    }

    try {
      for (const student of students) {
        const passwordHash = await bcrypt.hash(student.email, 10);

        const { data: authData, error: authError } = await supabase
          .from("student_auth")
          .insert({ email: student.email, password: passwordHash })
          .select("id");

        if (authError || !authData?.length) throw authError;

        const authId = authData[0].id;

        const { error: profileError } = await supabase.from("students").insert({
          auth_id: authId,
          admin_id: student.school_admin_id,
          name: student.name,
          age: student.age,
          class_assigned: student.class,
        });

        if (profileError) throw profileError;
      }

      toast.success("Students added successfully.");
      setStudents([]);
    } catch (err: any) {
      toast.error(err.message || "An error occurred while adding students.");
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-20">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        Add Students
      </h2>

      <Select value={selectedClass || ""} onValueChange={setSelectedClass}>
        <SelectTrigger>
          <SelectValue placeholder="Select Class" />
        </SelectTrigger>
        <SelectContent>
          {classOptions.map((className, idx) => (
            <SelectItem key={idx} value={className}>
              {className}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input_03
        label="Upload CSV file"
        id="csvUpload"
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
      />
      <p className="text-sm text-gray-500 mt-2">
        CSV should have columns: <b>name, email, phone</b>
      </p>
      <Table>
        <TableCaption>Student Details</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Class</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  type="text"
                  placeholder="Name"
                  value={student.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="email"
                  placeholder="Email"
                  value={student.email}
                  onChange={(e) =>
                    handleInputChange(index, "email", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  placeholder="Age"
                  value={student.age}
                  onChange={(e) =>
                    handleInputChange(index, "age", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Select
                  value={student.class}
                  onValueChange={(value: string) =>
                    handleInputChange(index, "class", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map((className, idx) => (
                      <SelectItem key={idx} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Button onClick={() => removeRow(index)} variant="destructive">
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between">
        <Button className="w-40" onClick={addRow}>
          Add Another Row
        </Button>
        <Button className="w-40" onClick={handleSubmit}>
          Submit Students
        </Button>
      </div>
    </div>
  );
};

export default AddStudents;
