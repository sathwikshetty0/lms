"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import bcrypt from "bcryptjs";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

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
    { id: string; school_name: string; classes: string[] }[]
  >([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string>("");
  const [classOptions, setClassOptions] = useState<string[]>([]);
  const [defaultClass, setDefaultClass] = useState<string>("");

  const supabase = createClient();

  useEffect(() => {
    const fetchSchoolAdmins = async () => {
      const { data, error } = await supabase
        .from("school_admins")
        .select("id, school_name, classes");

      if (error) {
        console.error("Error fetching school admins:", error);
      } else {
        setSchoolAdmins(data || []);
      }
    };

    fetchSchoolAdmins();
  }, []);

  const handleAdminChange = (adminId: string) => {
    setSelectedAdminId(adminId);

    // Update class options based on selected admin
    const selectedAdmin = schoolAdmins.find((admin) => admin.id === adminId);
    if (selectedAdmin) {
      setClassOptions(selectedAdmin.classes || []);
      setDefaultClass(selectedAdmin.classes[0] || ""); // Default to first class
    }
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
    setStudents([
      ...students,
      {
        name: "",
        email: "",
        age: "",
        class: defaultClass,
        school_admin_id: "",
      },
    ]);
  };

  const removeRow = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAdminId || !classOptions.length) {
      toast.warning("Please select a school and class before uploading a CSV.");
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
            age: row.age || "",
            class: defaultClass, // Set default class, can be updated later
            school_admin_id: selectedAdminId,
          }));
          setStudents((prev) => [...prev, ...parsedData]);
        }
      },
    });
  };

  const handleSubmit = async () => {
    if (students.length === 0) {
      toast.warning("No students to submit. Please upload a CSV first.");
      return;
    }

    try {
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

      // Hash passwords and prepare student_auth data
      const studentAuthData = await Promise.all(
        students.map(async (student) => ({
          email: student.email,
          password: await bcrypt.hash(student.email, 10),
        }))
      );

      // Insert students into the database
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .insert(students)
        .select();

      if (studentError) throw studentError;

      // Insert student_auth data
      const studentAuthRecords = studentData.map((student, index) => ({
        student_id: student.id,
        email: studentAuthData[index].email,
        password: studentAuthData[index].password,
      }));

      const { error: authError } = await supabase
        .from("student_auth")
        .insert(studentAuthRecords);

      if (authError) throw authError;

      toast.success(
        "Students added successfully and linked to the selected school!"
      );
      setStudents([]); // Clear form
    } catch (err: any) {
      toast.error(err.message || "An error occurred while adding students.");
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-20">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        Add Students
      </h2>
      <div className="flex gap-5">
        {/* School Admin Select */}
        <Select value={selectedAdminId} onValueChange={handleAdminChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select School" />
          </SelectTrigger>
          <SelectContent>
            {schoolAdmins.map((admin) => (
              <SelectItem key={admin.id} value={admin.id}>
                {admin.school_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Class Select (only shows after school admin is selected) */}
        <Select
          value={defaultClass}
          onValueChange={(value) => setDefaultClass(value)}
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
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Please select a school and class before uploading a CSV.
      </p>

      <div>
        <Input_03
          label="Upload CSV file"
          type="file"
          id="csvUpload"
          accept=".csv"
          onChange={handleCSVUpload}
        />
        <p className="text-sm text-gray-500 mt-2">
          CSV should have columns: <b>name, email, age, class</b>
        </p>
      </div>

      <Table>
        <TableCaption>Student Details</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>School</TableHead>
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
              <TableCell>
                <Select
                  value={student.school_admin_id}
                  onValueChange={(value: string) =>
                    handleInputChange(index, "school_admin_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select School" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolAdmins.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id}>
                        {admin.school_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  onClick={() =>
                    setStudents(students.filter((_, i) => i !== index))
                  }
                  variant={"destructive"}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between">
        <Button className="w-40" onClick={addRow}>
          Add Row
        </Button>
        <Button className="w-40" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddStudents;
