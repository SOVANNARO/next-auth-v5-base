"use client";

import { ReactNode } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  const title =
    pathnames.length > 1
      ? `${pathnames[pathnames.length - 2].charAt(0).toUpperCase() + pathnames[pathnames.length - 2].slice(1)} ${pathnames[pathnames.length - 1].charAt(0).toUpperCase() + pathnames[pathnames.length - 1].slice(1)}`
      : pathnames.length === 1
        ? pathnames[0].charAt(0).toUpperCase() + pathnames[0].slice(1)
        : "Dashboard";

  const generateBreadcrumbs = () => {
    if (pathname === "/dashboard") {
      return (
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

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
          <Link href={routeTo} passHref legacyBehavior>
            <a className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
              {label}
            </a>
          </Link>
        </BreadcrumbItem>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main
          className="flex-1 p-6 bg-white dark:bg-gray-800 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }}
        >
          {pathname !== "/dashboard" && (
            <>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <Link href="/" passHref legacyBehavior>
                      <a className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                        Dashboard
                      </a>
                    </Link>
                  </BreadcrumbItem>
                  {pathnames.length > 0 && (
                    <>
                      <BreadcrumbSeparator />
                      {generateBreadcrumbs()}
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 pt-5">
                {title}
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
