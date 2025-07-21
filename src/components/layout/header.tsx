
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  Contact,
  Home,
  Lightbulb,
  Menu,
  Library,
  Users,
  Shield,
  X,
  BarChart2,
  ChevronDown,
  PenSquare,
  ShieldCheck,
  UserCheck,
  GraduationCap
} from "lucide-react";
import { useState, Fragment } from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface NavLinkItem {
  href: string;
  label: string;
  icon: React.ElementType;
  subItems?: NavLinkItem[];
}

const navLinks: NavLinkItem[] = [
  { href: "/", label: "Home", icon: Home },
  {
    href: "/events",
    label: "Events",
    icon: Calendar,
    subItems: [
      { href: "/events", label: "All Events", icon: Calendar },
      { href: "/reports", label: "Reports", icon: BarChart2 },
    ],
  },
  {
    href: "/blog",
    label: "Content",
    icon: PenSquare,
    subItems: [
        { href: "/blog", label: "Blog", icon: BookOpen },
        { href: "/resources", label: "Resources", icon: Library },
        { href: "/ideation-tool", label: "Ideation Tool", icon: Lightbulb },
    ]
  },
  {
    href: "/members/core",
    label: "Members",
    icon: Users,
    subItems: [
      { href: "/members/core", label: "Core Team", icon: ShieldCheck },
      { href: "/members/active", label: "Active Team", icon: UserCheck },
      { href: "/members/faculty", label: "Faculty", icon: GraduationCap },
    ]
  },
  { href: "/contact", label: "Contact", icon: Contact },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({
    href,
    label,
    icon: Icon,
    isMobile = false,
    subItems,
  }: NavLinkItem & { isMobile?: boolean }) => {
    const isActive = pathname === href || (subItems && subItems.some(i => pathname.startsWith(i.href) && i.href !== '/'));

    if (subItems && subItems.length > 0) {
      if (isMobile) {
        return (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full gap-4 text-lg py-3 px-4 rounded-xl text-gray-300 font-medium hover:bg-white/10 group">
              <div className="flex items-center gap-4">
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </div>
              <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col pl-6 border-l border-white/10 ml-6 mt-2 space-y-1">
                {subItems.map(item => (
                  <NavLink key={item.href} {...item} isMobile />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(`relative transition-all duration-300 group text-sm font-medium px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm flex items-center gap-1`,
                isActive ? "text-white font-semibold" : "text-gray-300 hover:text-white"
              )}
            >
              <span>{label}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800 border-purple-500/30 text-white">
            {subItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }


    return (
      <Link
        href={href}
        className={cn(
          `relative transition-all duration-300 group`,
          isMobile
            ? "flex items-center gap-4 text-lg py-3 px-4 rounded-xl hover:bg-white/10 backdrop-blur-sm"
            : "text-sm font-medium px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm",
          pathname.startsWith(href) && href !== '/' || pathname === href ? 'text-white font-semibold bg-white/5' : 'text-gray-300 hover:text-white'
        )}
        onClick={() => isMobile && setIsOpen(false)}
      >
        { isMobile ? (
             <div className="flex items-center gap-4">
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span>{label}</span>
            </div>
            <div className={cn(
              `absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300`,
              isActive ? "w-full" : "w-0 group-hover:w-full"
              )} />
          </>
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glassmorphism background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Animated gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>

      <div className="relative container mx-auto flex h-20 items-center px-4">
        {/* Logo Section */}
        <div className="mr-8 hidden md:flex">
          <Link href="/" className="mr-8 flex items-center space-x-3 group">
            <Image src="/images/logo.png" alt="Digital Marketing Club Logo" width={48} height={48} />
            <div className="flex flex-col">
              <span className="font-bold text-white text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Digital Marketing Club
              </span>
              <span className="text-xs text-gray-300 font-light">
                Innovate • Connect • Grow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-2">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden w-full justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/images/Logo.png" alt="Digital Marketing Club Logo" width={40} height={40} />
            <span className="font-bold text-white text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              DMC
            </span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:bg-white/10 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
            <div className="absolute right-0 top-0 h-full w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl"></div>
              <div className="relative h-full flex flex-col">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <Link href="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
                    <Image src="/images/logo.png" alt="Digital Marketing Club Logo" width={48} height={48} />
                    <div className="flex flex-col">
                      <span className="font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        Digital Marketing Club
                      </span>
                      <span className="text-xs text-gray-300 font-light">
                        Innovate • Connect • Grow
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/10 backdrop-blur-sm rounded-full p-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-6 space-y-2">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} isMobile />
                  ))}

                </nav>
              </div>
            </div>
          </div>
        )}


      </div>
    </header>
  );
}
