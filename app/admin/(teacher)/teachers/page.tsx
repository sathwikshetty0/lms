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

interface Teacher {
  id: string;
  name: string;
  subject: string;
  phone: string;
  school_name: string;
  auth_id: string;
  email: string;
  class_assigned: string;
}

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<string>("All Schools"); // Update 2
  const [schoolNames, setSchoolNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const supabase = createClient();

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("teachers").select(`
            id, 
            name, 
            subject, 
            phone, 
            admin_id, 
            school_admins(school_name), 
            auth_id, 
            teacher_auth(email),
            class_assigned
          `);

        if (error) {
          throw new Error(error.message);
        }

        const formattedData = data.map((teacher: any) => ({
          id: teacher.id,
          name: teacher.name,
          subject: teacher.subject,
          phone: teacher.phone,
          school_name: teacher.school_admins.school_name,
          auth_id: teacher.auth_id,
          email: teacher.teacher_auth.email,
          class_assigned: teacher.class_assigned,
        }));

        setTeachers(formattedData);
        setFilteredTeachers(formattedData);

        // Extract unique school names
        const uniqueSchoolNames = Array.from(
          new Set(formattedData.map((teacher) => teacher.school_name))
        );
        setSchoolNames(uniqueSchoolNames);
      } catch (err: any) {
        toast.error(err.message || "Error fetching teachers.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [supabase]);

  const handleSearch = (query: string, school: string = selectedSchool) => {
    // Update 1
    setSearchQuery(query);
    setSelectedSchool(school);

    const lowerCaseQuery = query.toLowerCase();
    const filtered = teachers.filter(
      (teacher) =>
        (teacher.name.toLowerCase().includes(lowerCaseQuery) ||
          teacher.subject.toLowerCase().includes(lowerCaseQuery) ||
          teacher.phone.toLowerCase().includes(lowerCaseQuery) ||
          teacher.school_name.toLowerCase().includes(lowerCaseQuery) ||
          teacher.class_assigned.toLowerCase().includes(lowerCaseQuery) ||
          teacher.email.toLowerCase().includes(lowerCaseQuery)) &&
        (school === "All Schools" || teacher.school_name === school) // Update 1
    );

    setFilteredTeachers(filtered);
    setCurrentPage(0);
  };

  const handleSchoolChange = (value: string) => {
    handleSearch(searchQuery, value);
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredTeachers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedTeachers = filteredTeachers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-5 pb-20">
        <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
          Teachers List
        </h2>
        <SkeletonCardList />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-20">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        Teachers List
      </h2>
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search by Name, Subject, Phone, School Name, or Email"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-grow"
        />
        <Select value={selectedSchool} onValueChange={handleSchoolChange}>
          {" "}
          {/* Update 3 */}
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
            <TableHead>Subject</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>School Name</TableHead>
            <TableHead>Class Assigned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTeachers.length > 0 ? (
            paginatedTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.id}</TableCell>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.subject}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.school_name}</TableCell>
                <TableCell>{teacher.class_assigned}</TableCell>
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
          {Math.ceil(filteredTeachers.length / itemsPerPage)}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * itemsPerPage >= filteredTeachers.length}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TeachersPage;
