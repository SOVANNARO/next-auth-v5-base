import MainLayout from "@/components/layout/MainLayout";

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
];

const Dashboard = () => {
  return (
    <MainLayout title="Dashboard" breadcrumbs={breadcrumbs}>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;