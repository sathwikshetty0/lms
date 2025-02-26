"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import Papa from "papaparse";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Input_03 from "@/components/kokonutui/input-03";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SchoolAdmin = {
  name: string;
  email: string;
  phone: string;
  school_name: string;
  classes: string[];
};

const BulkSchoolAdminEntry = () => {
  const [admins, setAdmins] = useState<SchoolAdmin[]>([]);
  const supabase = createClient();

  const handleInputChange = (
    index: number,
    field: keyof Omit<SchoolAdmin, "classes">,
    value: string
  ) => {
    const updatedAdmins = [...admins];
    updatedAdmins[index][field] = value;
    setAdmins(updatedAdmins);
  };

  const handleClassChange = (index: number, classes: string) => {
    const updatedAdmins = [...admins];
    updatedAdmins[index].classes = classes.split(",").map((cls) => cls.trim());
    setAdmins(updatedAdmins);
  };

  const addRow = () => {
    setAdmins([
      ...admins,
      { name: "", email: "", phone: "", school_name: "", classes: [] },
    ]);
  };

  const removeRow = (index: number) => {
    setAdmins(admins.filter((_, i) => i !== index));
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          toast.error("Error parsing CSV file. Please check the file format.");
        } else {
          const parsedData: SchoolAdmin[] = result.data.map((row: any) => ({
            name: row.name || "",
            email: row.email || "",
            phone: row.phone || "",
            school_name: row.school_name || "",
            classes: (row.classes || "")
              .split(",")
              .map((cls: string) => cls.trim()),
          }));
          setAdmins((prev) => [...prev, ...parsedData]);
        }
      },
    });
  };

  const handleSubmit = async () => {
    if (
      admins.some(
        (admin) =>
          !admin.name ||
          !admin.email ||
          !admin.school_name ||
          admin.classes.length === 0
      )
    ) {
      toast.warning("All fields are required for every school admin.");
      return;
    }

    try {
      for (const admin of admins) {
        const passwordHash = await bcrypt.hash(admin.email, 10);

        // Insert into auth table
        const { data: authData, error: authError } = await supabase
          .from("school_admin_auth")
          .insert({ email: admin.email, password: passwordHash })
          .select("id");

        if (authError || !authData?.length) throw authError;

        const authId = authData[0].id;

        // Insert into profile table
        const { error: profileError } = await supabase
          .from("school_admins")
          .insert({
            auth_id: authId,
            name: admin.name,
            phone: admin.phone,
            school_name: admin.school_name,
            classes: admin.classes,
          });

        if (profileError) throw profileError;
      }

      toast.success("School admins added successfully.");
      setAdmins([]); // Reset form
    } catch (err: any) {
      toast.error(err.message || "An error occurred while adding admins.");
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-20">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        Add School Admins
      </h2>
      <div>
        <Input_03
          label="Upload CSV file"
          id="csvUpload"
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
        />
        <p className="text-sm text-gray-500 mt-2">
          CSV should have columns:{" "}
          <b>name, email, phone, school_name, classes</b>
          (comma-separated for classes)
        </p>
      </div>
      <div className="overflow-auto">
        <Table>
          <TableCaption>School Admin Details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>School Name</TableHead>
              <TableHead>Classes (comma-separated)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    type="text"
                    value={admin.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="email"
                    value={admin.email}
                    onChange={(e) =>
                      handleInputChange(index, "email", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={admin.phone}
                    onChange={(e) =>
                      handleInputChange(index, "phone", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={admin.school_name}
                    onChange={(e) =>
                      handleInputChange(index, "school_name", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={admin.classes.join(", ")}
                    onChange={(e) => handleClassChange(index, e.target.value)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    onClick={() => removeRow(index)}
                    variant={"destructive"}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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

export default BulkSchoolAdminEntry;
