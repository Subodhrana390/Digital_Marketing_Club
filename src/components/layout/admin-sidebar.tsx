
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
  FileText,
  UserPlus,
  Contact,
  MessageSquare,
} from "lucide-react";

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useState } from "react";

const adminNavLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/resources", label: "Resources", icon: Library },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/registrations", label: "Registrations", icon: UserPlus },
  { href: "/admin/contacts", label: "Contacts", icon: Contact },
];

const reportLinks = [
    { href: "/admin/reports", label: "Analytics", icon: BarChart2 },
    { href: "/admin/event-reports", label: "Event Reports", icon: FileText },
]

export default function AdminSidebar() {
  const pathname = usePathname();
  const isReportsActive = reportLinks.some(link => pathname.startsWith(link.href));
  const [isReportsOpen, setIsReportsOpen] = useState(isReportsActive);

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
                isActive={pathname.startsWith(link.href)}
                className="justify-start"
              >
                <Link href={link.href}>
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
           <Collapsible open={isReportsOpen} onOpenChange={setIsReportsOpen}>
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                         <SidebarMenuButton
                            isActive={isReportsActive}
                            className="justify-start w-full"
                        >
                            <BarChart2 className="h-4 w-4" />
                            <span>Reports</span>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                </SidebarMenuItem>
                 <CollapsibleContent asChild>
                    <SidebarMenuSub>
                        {reportLinks.map((link) => (
                            <SidebarMenuItem key={link.href}>
                                 <SidebarMenuSubButton asChild isActive={pathname === link.href}>
                                    <Link href={link.href}>
                                        <link.icon className="h-4 w-4" />
                                        <span>{link.label}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
           </Collapsible>
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
