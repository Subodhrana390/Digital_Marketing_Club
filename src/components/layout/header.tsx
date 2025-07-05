"use client";

import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/resources", label: "Resources", icon: Library },
  { href: "/members", label: "Members", icon: Users },
  { href: "/contact", label: "Contact", icon: Contact },
  { href: "/ideation-tool", label: "Ideation Tool", icon: Lightbulb },
];

export function Header() {
  const pathname = usePathname();

  const NavLink = ({
    href,
    label,
    icon: Icon,
    isMobile = false,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    isMobile?: boolean;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          "transition-colors hover:text-foreground",
          isActive ? "text-foreground font-semibold" : "text-muted-foreground",
          isMobile ? "flex items-center gap-4 text-lg" : "text-sm font-medium"
        )}
      >
        <div className="flex items-center gap-2">
            {isMobile && <Icon className="h-5 w-5" />}
            <span>{label}</span>
        </div>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span className="font-bold sm:inline-block font-headline">Digital Marketing Club</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
             {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </div>
        
        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-sm">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      A list of links to navigate the website.
                    </SheetDescription>
                  </SheetHeader>
                <Link href="/" className="mb-8 flex items-center space-x-2">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                    >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="font-bold font-headline">Digital Marketing Club</span>
                </Link>
                <nav className="grid gap-6 text-lg font-medium">
                    {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                        <NavLink {...link} isMobile />
                    </SheetClose>
                    ))}
                    <SheetClose asChild>
                        <Link href="/market-verse-admin-login" className="flex items-center gap-4 text-lg text-muted-foreground hover:text-foreground">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                <span>Admin Login</span>
                            </div>
                        </Link>
                    </SheetClose>
                </nav>
                </SheetContent>
            </Sheet>
        </div>

        {/* Desktop Login Button */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-2">
            <Button asChild>
              <Link href="/market-verse-admin-login">
                <Shield className="mr-2 h-4 w-4" />
                Admin Login
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
