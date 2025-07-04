import type { Metadata } from "next";
import {
  Sidebar,
  SidebarProvider,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/admin-sidebar";
import AdminHeader from "@/components/layout/admin-header";
import { AuthProvider, AuthGuard } from "@/hooks/use-auth";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for Digital Marketing Club",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <SidebarProvider>
            <Sidebar>
                <AdminSidebar />
            </Sidebar>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <AdminHeader />
                <div className="p-4 sm:px-6 sm:py-0">{children}</div>
            </div>
        </SidebarProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
