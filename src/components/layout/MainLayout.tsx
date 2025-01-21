import React from "react";
import { ReactNode } from "react";
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


interface MainLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

const MainLayout = ({ children, title, breadcrumbs }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main
          className="flex-1 p-6 bg-white overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }} // Adjust the value based on your Header height
        >
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {breadcrumb.href ? (
                      <BreadcrumbLink href={breadcrumb.href}>
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-semibold text-gray-900 mb-6 pt-5">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
