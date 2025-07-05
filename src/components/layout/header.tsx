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
} from "lucide-react";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

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
    const isActive = typeof window !== 'undefined' ? window.location.pathname === href : false;
    return (
      <Link
        href={href}
        className={`relative transition-all duration-300 group ${isActive
          ? "text-white font-semibold"
          : "text-gray-300 hover:text-white"
          } ${isMobile
            ? "flex items-center gap-4 text-lg py-3 px-4 rounded-xl hover:bg-white/10 backdrop-blur-sm"
            : "text-sm font-medium px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
          }`}
        onClick={() => isMobile && setIsOpen(false)}
      >
        <div className="flex items-center gap-2">
          {isMobile && <Icon className="h-5 w-5" />}
          <span>{label}</span>
        </div>
        {!isMobile && (
          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
            }`} />
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
            <Image src="/images/Logo.png" alt="Digital Marketing Club Logo" width={48} height={48} />
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
                    <Image src="/images/Logo.png" alt="Digital Marketing Club Logo" width={48} height={48} />
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
