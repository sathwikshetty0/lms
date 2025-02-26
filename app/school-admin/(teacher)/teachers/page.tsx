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

interface Teacher {
  id: string;
  name: string;
  subject: string;
  phone: string;
  school_name: string;
  auth_id: string;
  email: string;
}

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const supabase = createClient();

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          toast.error("No access token found. Please login.");
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const adminEmail = decodedToken.email;

        const { data, error } = await supabase.from("teachers").select(`
            id, 
            name, 
            subject, 
            phone, 
            admin_id, 
            school_admins(school_name, school_admin_auth(email)), 
            auth_id, 
            teacher_auth(email)
          `);

        if (error) {
          throw new Error(error.message);
        }

        // console.log(data);

        const formattedData = data
          .map((teacher: any) => ({
            id: teacher.id,
            name: teacher.name,
            subject: teacher.subject,
            phone: teacher.phone,
            school_name: teacher.school_admins.school_name,
            auth_id: teacher.auth_id,
            email: teacher.teacher_auth.email,
            admin_email: teacher.school_admins.school_admin_auth.email,
          }))
          .filter((teacher: any) => teacher.admin_email === adminEmail); // Filter teachers by admin email

        // Log the fetched teachers
        // console.log("Fetched Teachers:", formattedData);

        setTeachers(formattedData);
        setFilteredTeachers(formattedData);
      } catch (err: any) {
        toast.error(err.message || "Error fetching teachers.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [supabase]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const lowerCaseQuery = query.toLowerCase();
    const filtered = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(lowerCaseQuery) ||
        teacher.subject.toLowerCase().includes(lowerCaseQuery) ||
        teacher.phone.toLowerCase().includes(lowerCaseQuery) ||
        teacher.school_name.toLowerCase().includes(lowerCaseQuery) ||
        teacher.email.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredTeachers(filtered);
    setCurrentPage(0);
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
    <div className="flex flex-col gap-5">
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
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>School Name</TableHead>
            <TableHead>Email</TableHead>
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
                <TableCell>{teacher.school_name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
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
