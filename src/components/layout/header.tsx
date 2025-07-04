"use client";
import React, { useState, useEffect } from "react";
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
  ChevronDown,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function ModernHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/resources", label: "Resources", icon: Library },
    { href: "/members", label: "Members", icon: Users },
    { href: "/admin", label: "Admin", icon: Shield },
    { href: "/contact", label: "Contact", icon: Contact },
    { href: "/ideation-tool", label: "Ideation Tool", icon: Lightbulb },
  ];

  const NavLink = ({ href, label, icon: Icon, isMobile = false }) => {
    const isActive = activeLink === href;
    const isHovered = hoveredLink === href;

    return (
      <button
        onClick={() => setActiveLink(href)}
        onMouseEnter={() => setHoveredLink(href)}
        onMouseLeave={() => setHoveredLink(null)}
        className={`
          relative group transition-all duration-300 ease-out
          ${
            isMobile
              ? "flex items-center gap-4 w-full p-4 rounded-2xl text-left"
              : "px-4 py-2 rounded-full text-sm font-medium"
          }
          ${isActive ? "text-white" : "text-gray-300 hover:text-white"}
        `}
      >
        {/* Background for active/hover states */}
        <div
          className={`
          absolute inset-0 rounded-full transition-all duration-300
          ${
            isActive
              ? "bg-gradient-to-r from-purple-600 to-pink-600 opacity-100"
              : isHovered
              ? "bg-white/10 opacity-100"
              : "opacity-0"
          }
        `}
        />

        {/* Mobile background */}
        {isMobile && (
          <div
            className={`
            absolute inset-0 rounded-2xl transition-all duration-300
            ${
              isActive
                ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30"
                : isHovered
                ? "bg-white/5 border border-white/10"
                : "border border-transparent"
            }
          `}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex items-center gap-2">
          {isMobile && (
            <div
              className={`
              p-2 rounded-xl transition-all duration-300
              ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-white/10"
              }
            `}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
          <span className={isMobile ? "text-lg font-medium" : ""}>{label}</span>
          {!isMobile && isActive && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
          )}
        </div>

        {/* Hover glow effect */}
        {isHovered && !isMobile && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-lg scale-150 opacity-50" />
        )}
      </button>
    );
  };

  return (
    <>
      {/* Header */}
      <header
        className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          isScrolled
            ? "bg-black/80 backdrop-blur-md border-b border-white/10 shadow-2xl"
            : "bg-transparent"
        }
      `}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setActiveLink("/")}
                className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Digital Marketing Club
                  </div>
                  <div className="text-xs text-gray-400 -mt-1">
                    GNDEC Ludhiana
                  </div>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </nav>

            {/* CTA Button (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <span className="relative z-10 flex items-center">
                  Join Now
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 w-6 h-6 text-white transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "rotate-90 opacity-0"
                      : "rotate-0 opacity-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 w-6 h-6 text-white transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "rotate-0 opacity-100"
                      : "-rotate-90 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`
        fixed inset-0 z-40 lg:hidden transition-all duration-300
        ${isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"}
      `}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`
          absolute top-0 right-0 h-full w-80 max-w-[90vw] transition-all duration-300 ease-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
        >
          <div className="h-full bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-md border-l border-white/10 overflow-y-auto">
            {/* Mobile Menu Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">DMC</div>
                    <div className="text-xs text-gray-400">GNDEC</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div className="p-6 space-y-2">
              {navLinks.map((link) => (
                <div key={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <NavLink {...link} isMobile />
                </div>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="p-6 border-t border-white/10">
              <button className="w-full group relative px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <span className="relative z-10 flex items-center justify-center">
                  Join Our Community
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
