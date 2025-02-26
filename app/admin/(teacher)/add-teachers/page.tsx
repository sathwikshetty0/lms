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

type Teacher = {
  name: string;
  email: string;
  subject: string;
  phone: string;
  school_admin_id: string;
  class_assigned: string;
};

const AddTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schoolAdmins, setSchoolAdmins] = useState<
    { id: string; school_name: string; classes: string[] }[]
  >([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [classOptions, setClassOptions] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchSchoolAdmins = async () => {
      const { data, error } = await supabase
        .from("school_admins")
        .select("id, school_name, classes");

      if (error) {
        console.error("Failed to fetch school admins:", error);
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
    setClassOptions(selectedAdmin?.classes || []);
  };

  const handleInputChange = (
    index: number,
    field: keyof Teacher,
    value: string
  ) => {
    const updatedTeachers = [...teachers];
    updatedTeachers[index][field] = value;
    setTeachers(updatedTeachers);
  };

  const addRow = () => {
    if (!selectedAdminId) {
      toast.warning("Please select a school admin before adding rows.");
      return;
    }
    setTeachers([
      ...teachers,
      {
        name: "",
        email: "",
        subject: "",
        phone: "",
        school_admin_id: selectedAdminId,
        class_assigned: "",
      },
    ]);
  };

  const removeRow = (index: number) => {
    setTeachers(teachers.filter((_, i) => i !== index));
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAdminId) {
      toast.warning("Please select a school admin before uploading a CSV.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          toast.error("Error parsing CSV file. Please check the file format.");
        } else {
          const parsedData: Teacher[] = result.data.map((row: any) => ({
            name: row.name || "",
            email: row.email || "",
            subject: row.subject || "",
            phone: row.phone || "",
            school_admin_id: selectedAdminId,
            class_assigned: "",
          }));
          setTeachers((prev) => [...prev, ...parsedData]);
        }
      },
    });
  };

  const handleSubmit = async () => {
    if (teachers.length === 0) {
      toast.warning("No teachers to submit. Please upload a CSV or add rows.");
      return;
    }

    if (
      teachers.some(
        (teacher) =>
          !teacher.name ||
          !teacher.email ||
          !teacher.subject ||
          !teacher.school_admin_id ||
          !teacher.class_assigned
      )
    ) {
      toast.warning("All fields are required for every teacher.");
      return;
    }

    try {
      for (const teacher of teachers) {
        const passwordHash = await bcrypt.hash(teacher.email, 10);

        const { data: authData, error: authError } = await supabase
          .from("teacher_auth")
          .insert({ email: teacher.email, password: passwordHash })
          .select("id");

        if (authError || !authData?.length) throw authError;

        const authId = authData[0].id;

        const { error: profileError } = await supabase.from("teachers").insert({
          auth_id: authId,
          admin_id: teacher.school_admin_id,
          name: teacher.name,
          subject: teacher.subject,
          phone: teacher.phone,
          class_assigned: teacher.class_assigned,
        });

        if (profileError) throw profileError;
      }

      toast.success("Teachers added successfully.");
      setTeachers([]);
    } catch (err: any) {
      toast.error(err.message || "An error occurred while adding teachers.");
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-20">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        Add Teachers
      </h2>
      <div className="flex gap-4">
        <Select onValueChange={handleAdminChange} value={selectedAdminId || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select School Admin" />
          </SelectTrigger>
          <SelectContent>
            {schoolAdmins.map((admin) => (
              <SelectItem key={admin.id} value={admin.id}>
                {admin.school_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-4">
        <Input_03
          label="Upload CSV file"
          id="csvUpload"
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        CSV should have columns: <b>name, email, subject, phone</b>
      </p>
      <Table>
        <TableCaption>Teacher Details</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Class Assigned</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  type="text"
                  placeholder="Name"
                  value={teacher.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="email"
                  placeholder="Email"
                  value={teacher.email}
                  onChange={(e) =>
                    handleInputChange(index, "email", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  placeholder="Subject"
                  value={teacher.subject}
                  onChange={(e) =>
                    handleInputChange(index, "subject", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  placeholder="Phone"
                  value={teacher.phone}
                  onChange={(e) =>
                    handleInputChange(index, "phone", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Select
                  value={teacher.class_assigned}
                  onValueChange={(value: string) =>
                    handleInputChange(index, "class_assigned", value)
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
          Submit Teachers
        </Button>
      </div>
    </div>
  );
};

export default AddTeachers;
