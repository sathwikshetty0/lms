"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SkeletonCardList } from "@/components/SkeletonCard";

interface Student {
  id: string;
  name: string;
  email: string;
  age: number;
  class: string;
  school_admin_id: string;
  school_name: string;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<string>("All Schools");
  const [schoolNames, setSchoolNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const supabase = createClient();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("students").select(`
          id, 
          name, 
          email, 
          age,
          class,
          school_admin_id, 
          school_admins(school_name)
        `);

        if (error) {
          throw new Error(error.message);
        }

        const formattedData = data.map((student: any) => ({
          id: student.id,
          name: student.name,
          email: student.email,
          age: student.age,
          class: student.class,
          school_admin_id: student.school_admin_id,
          school_name: student.school_admins.school_name,
        }));

        setStudents(formattedData);
        setFilteredStudents(formattedData);

        // Extract unique school names
        const uniqueSchoolNames = Array.from(
          new Set(formattedData.map((student) => student.school_name))
        );
        setSchoolNames(uniqueSchoolNames);
      } catch (err: any) {
        toast.error(err.message || "Error fetching students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [supabase]);

  const handleSearch = (query: string, school: string = selectedSchool) => {
    setSearchQuery(query);
    setSelectedSchool(school);

    const lowerCaseQuery = query.toLowerCase();
    const filtered = students.filter(
      (student) =>
        (student.name.toLowerCase().includes(lowerCaseQuery) ||
          student.email.toLowerCase().includes(lowerCaseQuery) ||
          student.class.toLowerCase().includes(lowerCaseQuery) ||
          student.school_name.toLowerCase().includes(lowerCaseQuery)) &&
        (school === "All Schools" || student.school_name === school)
    );

    setFilteredStudents(filtered);
    setCurrentPage(0);
  };

  const handleSchoolChange = (value: string) => {
    handleSearch(searchQuery, value);
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredStudents.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedStudents = filteredStudents.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-5 pb-20">
        <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
          Students List
        </h2>
        <SkeletonCardList />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-20">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        Students List
      </h2>
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search by Name, Email, Class, or School Name"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-grow"
        />
        <Select value={selectedSchool} onValueChange={handleSchoolChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select School" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Schools">All Schools</SelectItem>
            {schoolNames.map((schoolName) => (
              <SelectItem key={schoolName} value={schoolName}>
                {schoolName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>School Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.age}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.school_name}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          variant="outline"
        >
          Previous
        </Button>
        <span>
          Page {currentPage + 1} of{" "}
          {Math.ceil(filteredStudents.length / itemsPerPage)}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * itemsPerPage >= filteredStudents.length}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StudentsPage;
