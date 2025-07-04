"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Newspaper,
  Library,
  Users,
  BarChart2,
  ArrowLeft,
  Shield,
} from "lucide-react";

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const adminNavLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/resources", label: "Resources", icon: Library },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <SidebarHeader>
        <Link
          href="/admin"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-headline">Admin Panel</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 px-2">
        <SidebarMenu>
          {adminNavLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                className="justify-start"
              >
                <Link href={link.href}>
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="justify-start">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </div>
  );
}