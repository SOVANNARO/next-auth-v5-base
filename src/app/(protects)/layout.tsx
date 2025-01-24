import MainLayout from "@/components/layout/MainLayout";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default DashboardLayout;
