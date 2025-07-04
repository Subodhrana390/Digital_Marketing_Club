"use client";
import React, { useState, useEffect } from "react";
import {
  Rocket,
  Target,
  Users,
  ArrowRight,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  Globe,
  Zap,
  Star,
  ChevronRight,
  Play,
} from "lucide-react";

export default function DigitalMarketingClub() {
  const [scrollY, setScrollY] = useState(0);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Rocket,
      title: "Hands-On Workshops",
      description:
        "Master the latest digital marketing tools and platforms through practical, industry-focused sessions.",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: Target,
      title: "Industry Connections",
      description:
        "Network with professionals and learn from guest speakers from top marketing companies.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Users,
      title: "Collaborative Projects",
      description:
        "Build your portfolio with real-world marketing campaigns alongside talented peers.",
      color: "from-pink-500 to-red-600",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description:
        "Dive deep into data-driven marketing strategies and performance optimization techniques.",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description:
        "Understand international marketing trends and cross-cultural digital strategies.",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: Award,
      title: "Certification Programs",
      description:
        "Earn industry-recognized certifications in Google Ads, Facebook Marketing, and more.",
      color: "from-teal-500 to-blue-600",
    },
  ];

  const stats = [
    { number: "500+", label: "Active Members" },
    { number: "50+", label: "Industry Partners" },
    { number: "25+", label: "Workshops Conducted" },
    { number: "95%", label: "Placement Rate" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-purple-900/30 to-black/50"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm mb-6">
                  <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-sm font-medium text-gray-300">
                    Guru Nanak Dev Engineering College
                  </span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                  Digital Marketing
                  <span className="block text-4xl lg:text-6xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Club
                  </span>
                </h1>
              </div>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Your launchpad into the universe of digital marketing. Connect,
                learn, and grow with the brightest minds at
                <span className="text-purple-400 font-semibold">
                  {" "}
                  GNDEC Ludhiana
                </span>
                .
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105">
                  <span className="relative z-10 flex items-center">
                    Join Our Community
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button className="group px-8 py-4 border-2 border-purple-500/50 rounded-full font-semibold text-purple-200 hover:bg-purple-500/10 transition-all duration-300 backdrop-blur-sm">
                  <span className="flex items-center">
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </span>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Rocket className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Ready to Launch?
                    </h3>
                    <p className="text-gray-300">
                      Join 500+ students already building their digital
                      marketing careers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm mb-6">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-gray-300">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Empowering Future
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Marketing Leaders
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We provide our members with cutting-edge knowledge, practical
              skills, and industry connections necessary to excel in the
              fast-paced world of digital marketing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${
                      feature.color.split(" ")[1]
                    }, ${feature.color.split(" ")[3]})`,
                  }}
                ></div>

                <div className="relative h-full bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 group-hover:border-white/20 transition-all duration-300 transform group-hover:scale-105">
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-purple-400 font-semibold group-hover:text-pink-400 transition-colors">
                    Learn More
                    <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/10">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to Transform Your
                  <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Digital Marketing Journey?
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join GNDEC's most dynamic club and unlock your potential in
                  the digital marketing universe. Your success story starts
                  here.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105">
                    <span className="relative z-10 flex items-center">
                      <Calendar className="mr-2 w-5 h-5" />
                      Book Your Spot
                    </span>
                  </button>

                  <button className="group px-8 py-4 border-2 border-purple-500/50 rounded-full font-semibold text-purple-200 hover:bg-purple-500/10 transition-all duration-300 backdrop-blur-sm">
                    <span className="flex items-center">
                      <BookOpen className="mr-2 w-5 h-5" />
                      Explore Resources
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Digital Marketing Club
            </h3>
            <p className="text-gray-400 mb-4">
              Guru Nanak Dev Engineering College, Ludhiana
            </p>
            <div className="flex justify-center space-x-6 text-gray-400">
              <span>© 2025 GNDEC DMC</span>
              <span>•</span>
              <span>Building Digital Leaders</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
