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

interface SchoolAdmin {
  id: string;
  name: string;
  phone: string;
  school_name: string;
  auth_id: string;
  email: string;
}

const SchoolAdminsPage = () => {
  const [schoolAdmins, setSchoolAdmins] = useState<SchoolAdmin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<SchoolAdmin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const supabase = createClient();

  useEffect(() => {
    const fetchSchoolAdmins = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("school_admins")
          .select(
            "id, name, phone, school_name, auth_id, school_admin_auth(email)"
          );

        if (error) {
          throw new Error(error.message);
        }

        // Map the results to flatten the joined data
        const formattedData = data.map((admin: any) => ({
          id: admin.id,
          name: admin.name,
          phone: admin.phone,
          school_name: admin.school_name,
          auth_id: admin.auth_id,
          email: admin.school_admin_auth.email,
        }));

        setSchoolAdmins(formattedData);
        setFilteredAdmins(formattedData);
      } catch (err: any) {
        toast.error(err.message || "Error fetching school admins.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolAdmins();
  }, [supabase]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const lowerCaseQuery = query.toLowerCase();
    const filtered = schoolAdmins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(lowerCaseQuery) ||
        admin.phone.toLowerCase().includes(lowerCaseQuery) ||
        admin.school_name.toLowerCase().includes(lowerCaseQuery) ||
        admin.email.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredAdmins(filtered);
    setCurrentPage(0); // Reset to the first page after search
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredAdmins.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedAdmins = filteredAdmins.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-5 pb-20">
        <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
          School Admins List
        </h2>
        <SkeletonCardList />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-20">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        School Admins List
      </h2>
      <Input
        type="text"
        placeholder="Search by Name, Phone, School Name, or Email"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>School Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedAdmins.length > 0 ? (
            paginatedAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.id}</TableCell>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.phone}</TableCell>
                <TableCell>{admin.school_name}</TableCell>
                <TableCell>{admin.email}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
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
          {Math.ceil(filteredAdmins.length / itemsPerPage)}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * itemsPerPage >= filteredAdmins.length}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SchoolAdminsPage;
