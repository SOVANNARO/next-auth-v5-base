"use client";

import React, { ReactNode } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation"; // Use usePathname instead of useRouter

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const pathname = usePathname(); // Get the current path
  const pathnames = pathname.split("/").filter((x) => x); // Split the path into segments

  // Get the title from the last two segments of the URL
  const title =
    pathnames.length > 1
      ? `${pathnames[pathnames.length - 2].charAt(0).toUpperCase() + pathnames[pathnames.length - 2].slice(1)} ${pathnames[pathnames.length - 1].charAt(0).toUpperCase() + pathnames[pathnames.length - 1].slice(1)}`
      : pathnames.length === 1
        ? pathnames[0].charAt(0).toUpperCase() + pathnames[0].slice(1)
        : "Dashboard";

  const generateBreadcrumbs = () => {
    // If the path is just "/dashboard", return only the "Dashboard" breadcrumb
    if (pathname === "/dashboard") {
      return (
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

    // Otherwise, generate breadcrumbs dynamically
    return pathnames.map((path, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
      const isLast = index === pathnames.length - 1;
      const label = path.charAt(0).toUpperCase() + path.slice(1);

      return isLast ? (
        <BreadcrumbItem key={routeTo}>
          <BreadcrumbPage>{label}</BreadcrumbPage>
        </BreadcrumbItem>
      ) : (
        <BreadcrumbItem key={routeTo}>
          <BreadcrumbLink href={routeTo}>{label}</BreadcrumbLink>
        </BreadcrumbItem>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main
          className="flex-1 p-6 bg-white overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }} // Adjust the value based on your Header height
        >
          {/* Conditionally render Breadcrumb and Title */}
          {pathname !== "/dashboard" && (
            <>
              <Breadcrumb>
                <BreadcrumbList>
                  {/* Always show "Dashboard" as the first breadcrumb */}
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  {/* Show separator and dynamic breadcrumbs only if path is not "/dashboard" */}
                  {pathnames.length > 0 && (
                    <>
                      <BreadcrumbSeparator />
                      {generateBreadcrumbs()}
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-2xl font-semibold text-gray-900 mb-6 pt-5">
                {title} {/* Dynamically set the title based on the URL */}
              </h1>
            </>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;