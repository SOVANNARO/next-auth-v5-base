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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const {
    createUser,
    updateUser,
    deleteUser,
    isPendingCreateUser,
    isPendingUpdateUser,
  } = useMutateUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [userDetail, setUserDetail] = useState<User | null>(null);

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
      toast({
        description: "User Created",
      });
    } catch (error) {
      toast({
        description: "Error Creating User",
      });
    }
  };

  const handleEditUser = async (data: UserFormData & { id: number }) => {
    try {
      const userData: ICreateUser & { id: number } = {
        ...data,
        id: data.id,
        password: data.password || "",
        avatar: data.avatar || "",
      };
      await updateUser(userData);
      setIsEditMode(false);
      setIsDrawerOpen(false);
      toast({
        description: "User Updated",
      });
    } catch (error) {
      toast({
        description: "Error Updating User",
      });
    }
  };

  const handleEdit = (user: User) => {
    reset({
      name: user.name,
      email: user.email,
      password: user.password,
      avatar: user.avatar,
    });
    setEditingUserId(Number(user.id));
    setIsDrawerOpen(true);
    setIsEditMode(true);
  };

  const handleSubmitForm = async (data: UserFormData) => {
    if (isEditMode && editingUserId !== null) {
      await handleEditUser({ ...data, id: editingUserId });
    } else {
      await handleCreateUser(data);
    }
  };

  const handleViewDetail = (user: User) => {
    setUserDetail(user);
    setIsDetailDrawerOpen(true);
  };

  const handleDelete = async (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(Number(userToDelete.id));
        toast({
          description: "User Deleted",
        });
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        toast({
          description: "Error Deleting User",
        });
      }
    }
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

  const handleOpenDrawer = () => {
    reset({
      name: "",
      email: "",
      password: "",
      avatar: "",
    });
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    reset();
  };

  const handleCloseDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
    setUserDetail(null);
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <div>
              <Button size="sm" onClick={handleOpenDrawer}>
                <Plus className="h-4 w-4" />
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
              <form onSubmit={handleSubmit(handleSubmitForm)}>
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
                onClick={handleSubmit(handleSubmitForm)}
                disabled={
                  !isValid || isPendingCreateUser || isPendingUpdateUser
                }
              >
                {isPendingCreateUser || isPendingUpdateUser
                  ? "Processing..."
                  : isEditMode
                    ? "Update User"
                    : "Create User"}
              </Button>

              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCloseDrawer}
                >
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Drawer open={isDetailDrawerOpen} onOpenChange={setIsDetailDrawerOpen}>
        <DrawerContent className="w-[400px] ml-auto h-full flex flex-col bg-background">
          <DrawerHeader className="border-b">
            <DrawerTitle className="text-xl font-semibold text-foreground">
              User Details
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-6 flex-grow overflow-y-auto">
            {userDetail && (
              <div className="space-y-6">
                {/* Avatar */}
                <div className="space-y-1 flex flex-col items-center">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userDetail.avatar} alt="User Avatar" />
                      <AvatarFallback className="text-3xl bg-muted text-foreground">
                        {userDetail.name
                          ? userDetail.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* ID */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-muted-foreground">
                    ID
                  </label>
                  <p className="text-sm text-foreground">{userDetail.id}</p>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="text-sm text-foreground">{userDetail.name}</p>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-sm text-foreground break-all">
                    {userDetail.email}
                  </p>
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Role
                  </label>
                  <p className="text-sm text-foreground">{userDetail.role}</p>
                </div>

                {/* Creation Date */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Creation Date
                  </label>
                  <p className="text-sm text-foreground">
                    {new Date(userDetail.creationAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DrawerFooter className="border-t p-4">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCloseDetailDrawer}
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UsersPage;
