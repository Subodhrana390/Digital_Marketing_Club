import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/admin-sidebar";
import AdminHeader from "@/components/layout/admin-header";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased bg-background">
        <SidebarProvider>
            <Sidebar>
                <AdminSidebar />
            </Sidebar>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <AdminHeader />
                <main className="p-4 sm:px-6 sm:py-0">{children}</main>
            </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}