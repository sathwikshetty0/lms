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
import { toast } from "sonner";
import { SkeletonCardList } from "@/components/SkeletonCard";

interface Student {
  id: string;
  name: string;
  email: string;
  age: string;
  class: string;
  school_name: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const supabase = createClient();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          toast.error("No access token found. Please login.");
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const adminEmail = decodedToken.email;

        const { data, error } = await supabase.from("students").select(`
            id, 
            name, 
            email, 
            age,
            class,
            school_admin_id, 
            school_admins (
                school_name,
                school_admin_auth (
                    email
                )
            )
        `);

        if (error) throw new Error(error.message);

        const formattedData = data
          .map((student: any) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            age: student.age,
            class: student.class,
            school_name: student.school_admins?.school_name,
            admin_email: student.school_admins?.school_admin_auth?.email,
          }))
          .filter((student: any) => student.admin_email === adminEmail);

        setStudents(formattedData);
        setFilteredStudents(formattedData);
      } catch (err: any) {
        toast.error(err.message || "Error fetching students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [supabase]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const lowerCaseQuery = query.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(lowerCaseQuery) ||
        student.email.toLowerCase().includes(lowerCaseQuery) ||
        student.age.toLowerCase().includes(lowerCaseQuery) ||
        student.class.toLowerCase().includes(lowerCaseQuery) ||
        student.school_name.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredStudents(filtered);
    setCurrentPage(0);
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
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        Students List
      </h2>
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search by Name, Subject, Phone, School Name, or Email"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-grow"
        />
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

export default Students;
