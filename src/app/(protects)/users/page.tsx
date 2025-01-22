"use client";

import { useState } from "react";
import useUserQuery from "@/stores/users/useUserQuery";
import { User } from "@/types/login/auth";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"; // Import Button component
import { Eye, Pencil, Trash } from "lucide-react"; // Import icons for actions

const UsersPage = () => {
  const { data, error, isLoading } = useUserQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const totalPages = data ? Math.ceil(data.length / usersPerPage) : 0;
  const currentUsers = data?.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  // Configuration for table columns
  const columns = [
    { key: "id", header: "ID", className: "w-[100px]", align: "left" },
    { key: "name", header: "Name", align: "left" },
    { key: "email", header: "Email", align: "left" },
    { key: "role", header: "Role", align: "left" },
    { key: "creationAt", header: "Creation Date", className: "text-right", align: "right" },
    { key: "actions", header: "Actions", className: "text-right", align: "right" }, // New Actions column
  ];

  // Handlers for actions
  const handleEdit = (user: User) => {
    console.log("Edit user:", user);
    // Add your edit logic here
  };

  const handleViewDetail = (user: User) => {
    console.log("View detail for user:", user);
    // Add your view detail logic here
  };

  const handleDelete = (user: User) => {
    console.log("Delete user:", user);
    // Add your delete logic here
  };

  if (error) return <div>Error loading users</div>;

  return (
    <>
      <Table className="compact-table">
        <TableCaption>A list of your users.</TableCaption>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: usersPerPage }).map((_, index) => (
              <TableRow key={index} className="h-10">
                {columns.map((col) => (
                  <TableCell key={col.key} className={`${col.className} py-1`}>
                    {col.key === "actions" ? (
                      <div className="flex gap-2 justify-end">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    ) : (
                      <Skeleton
                        className={`h-4 ${col.key === "name" ? "w-[150px]" : col.key === "email" ? "w-[200px]" : "w-[100px]"}`}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
            : currentUsers?.map((user: User) => (
              <TableRow key={user.id} className="h-10">
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={`${col.align === "right" ? "text-right" : ""} ${col.key === "id" ? "font-medium" : ""} py-1`}
                  >
                    {col.key === "creationAt"
                      ? new Date(user[col.key as keyof User]).toLocaleDateString()
                      : col.key === "actions"
                        ? (
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetail(user)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(user)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                        : user[col.key as keyof User]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {!isLoading && (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink href="#" onClick={() => handlePageChange(i + 1)} isActive={currentPage === i + 1}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default UsersPage;