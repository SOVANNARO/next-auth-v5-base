"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useQueryUser from "@/stores/users/useQueryUser";
import { ICreateUser, User } from "@/types/login/auth";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, Plus } from "lucide-react";
import Pagination from "@/components/table/Pagination";
import { z } from "zod";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import useMutateUser from "@/stores/users/useMutateUser";
import { useToast } from "@/hooks/use-toast";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  avatar: z.string().url("Invalid URL").optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

const UsersPage = () => {
  const { toast } = useToast();
  const { data, error, isLoading } = useQueryUser();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const { createUser } = useMutateUser();

  const totalPages = data ? Math.ceil(data.length / usersPerPage) : 0;
  const currentUsers = data?.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      avatar: "",
    },
    mode: "onTouched",
  });

  const [isEditMode, setIsEditMode] = useState(false);

  const handleCreateUser = async (data: UserFormData) => {
    try {
      const userData: ICreateUser = {
        ...data,
        password: data.password || "",
        avatar: data.avatar || "",
      };
      await createUser(userData);
      reset();
      toast({
        title: "Scheduled: Catch up",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });
    } catch (error) {
      toast({
        title: "Scheduled: Catch up",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });
    }
  };

  const handleEditUser = (data: UserFormData) => {
    console.log("Edited User:", data);
    reset();
    setIsEditMode(false);
  };

  const handleEdit = (user: User) => {
    reset({
      name: user.name,
      email: user.email,
      password: "",
      avatar: user.avatar,
    });
    setIsEditMode(true);
  };

  const handleViewDetail = (user: User) => {
    console.log("View detail for user:", user);
  };

  const handleDelete = (user: User) => {
    console.log("Delete user:", user);
  };

  const headers = ["ID", "Name", "Email", "Role", "Creation Date", "Actions"];

  const renderSkeletonRows = () => {
    return Array.from({ length: usersPerPage }).map((_, index) => (
      <TableRow key={index} className="h-10">
        {headers.map((_, i) => (
          <TableCell key={i}>
            <Skeleton
              className={`h-4 ${i === 2 ? "w-[200px]" : i === 1 ? "w-[150px]" : "w-[100px]"}`}
            />
          </TableCell>
        ))}
        <TableCell className="text-right">
          <div className="flex gap-2 justify-end">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  const renderDataRows = () => {
    const userKeys = [
      { key: "id" as const, label: "ID" },
      { key: "name" as const, label: "Name" },
      { key: "email" as const, label: "Email" },
      { key: "role" as const, label: "Role" },
      {
        key: "creationAt" as const,
        label: "Creation Date",
        format: (value: string) => new Date(value).toLocaleDateString(),
      },
    ];

    return currentUsers?.map((user: User) => (
      <TableRow key={user.id} className="h-10">
        {userKeys.map(({ key, label, format }) => (
          <TableCell
            key={key}
            className={label === "Creation Date" ? "text-right" : ""}
          >
            {format ? format(user[key]) : user[key]}
          </TableCell>
        ))}
        <TableCell className="text-right">
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetail(user)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(user)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  if (error) return <div>Error loading users</div>;

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Drawer>
          <DrawerTrigger asChild>
            <div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </DrawerTrigger>
          <DrawerContent className="w-[400px] ml-auto h-full flex flex-col">
            <DrawerHeader>
              <DrawerTitle>{isEditMode ? "Edit User" : "Add User"}</DrawerTitle>
              <DrawerDescription>
                {isEditMode
                  ? "Edit the user details below."
                  : "Add a new user below."}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4 flex-grow overflow-y-auto">
              <form
                onSubmit={handleSubmit(
                  isEditMode ? handleEditUser : handleCreateUser,
                )}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Name
                    </label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Input
                            {...field}
                            id="name"
                            placeholder="Enter name"
                            className={error ? "border-red-500" : ""}
                          />
                          {error && (
                            <p className="text-sm text-red-500">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email
                    </label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Input
                            {...field}
                            id="email"
                            placeholder="Enter email"
                            className={error ? "border-red-500" : ""}
                          />
                          {error && (
                            <p className="text-sm text-red-500">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium"
                    >
                      Password
                    </label>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Input
                            {...field}
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            className={error ? "border-red-500" : ""}
                          />
                          {error && (
                            <p className="text-sm text-red-500">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="avatar"
                      className="block text-sm font-medium"
                    >
                      Avatar URL
                    </label>
                    <Controller
                      name="avatar"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Input
                            {...field}
                            id="avatar"
                            placeholder="Enter avatar URL"
                            className={error ? "border-red-500" : ""}
                          />
                          {error && (
                            <p className="text-sm text-red-500">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
              </form>
            </div>
            <DrawerFooter className="w-full mt-auto">
              <Button
                type="submit"
                className="w-full"
                onClick={handleSubmit(
                  isEditMode ? handleEditUser : handleCreateUser,
                )}
                disabled={!isValid}
              >
                {isEditMode ? "Update User" : "Create User"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <Table className="compact-table">
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead
                key={index}
                className={
                  header === "Actions" || header === "Creation Date"
                    ? "text-right"
                    : ""
                }
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? renderSkeletonRows() : renderDataRows()}
        </TableBody>
      </Table>
      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default UsersPage;
