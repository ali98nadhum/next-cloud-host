import AdminSidebar from "./AdminSidebar";
import type { Metadata } from "next";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Admin Dashborad",
  description: "this my first project in next js",
};

const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  return (
    <div className="overFlow-height flex items-start justify-between overflow-hidden">
      <div className="overFlow-height w-15 lg:w-1/5 bg-purple-600 text-white p-1 lg:p-5">
        <AdminSidebar />
      </div>
      <div className="overFlow-height w-full lg:w-4/5 overflow-y-scroll">{children}</div>
    </div>
  );
};

export default AdminDashboardLayout;
