<<<<<<< HEAD
"use client";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Filter,
  Search,
  Zap,
  Award,
  TrendingUp,
  Globe,
} from "lucide-react";
=======
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { getEvents } from "@/services/events";
>>>>>>> 24ff1a9 (in register now i add registration link)

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Google Ads Mastery Workshop",
      description:
        "Learn to create high-converting Google Ads campaigns with industry experts. Master keyword research, ad copywriting, and bid optimization.",
      date: "2025-07-15",
      time: "10:00 AM - 4:00 PM",
      location: "Main Auditorium, GNDEC",
      category: "workshop",
      attendees: 45,
      featured: true,
      gradient: "from-blue-500 to-purple-600",
      icon: TrendingUp,
    },
    {
      id: 2,
      title: "Social Media Strategy Bootcamp",
      description:
        "Dive deep into social media marketing strategies across platforms. Learn content creation, community management, and analytics.",
      date: "2025-07-20",
      time: "2:00 PM - 6:00 PM",
      location: "Digital Lab, Block A",
      category: "bootcamp",
      attendees: 32,
      featured: false,
      gradient: "from-pink-500 to-red-600",
      icon: Globe,
    },
    {
      id: 3,
      title: "Industry Leaders Panel Discussion",
      description:
        "Network with top marketing professionals from leading companies. Get insights into career paths and industry trends.",
      date: "2025-07-25",
      time: "6:00 PM - 8:00 PM",
      location: "Conference Hall, GNDEC",
      category: "networking",
      attendees: 78,
      featured: true,
      gradient: "from-purple-500 to-pink-600",
      icon: Users,
    },
    {
      id: 4,
      title: "Email Marketing Automation",
      description:
        "Master the art of email marketing with hands-on experience in automation tools, segmentation, and performance tracking.",
      date: "2025-07-30",
      time: "11:00 AM - 3:00 PM",
      location: "Computer Lab 2, Block B",
      category: "workshop",
      attendees: 28,
      featured: false,
      gradient: "from-green-500 to-teal-600",
      icon: Zap,
    },
    {
      id: 5,
      title: "Digital Marketing Certification",
      description:
        "Complete certification program covering all aspects of digital marketing. Earn industry-recognized credentials.",
      date: "2025-08-05",
      time: "9:00 AM - 5:00 PM",
      location: "Main Auditorium, GNDEC",
      category: "certification",
      attendees: 55,
      featured: true,
      gradient: "from-orange-500 to-red-600",
      icon: Award,
    },
    {
      id: 6,
      title: "SEO & Content Marketing",
      description:
        "Learn search engine optimization and content strategy. Understand keyword research, on-page SEO, and content planning.",
      date: "2025-08-10",
      time: "1:00 PM - 5:00 PM",
      location: "Seminar Hall, Block C",
      category: "workshop",
      attendees: 41,
      featured: false,
      gradient: "from-teal-500 to-blue-600",
      icon: Search,
    },
  ];

  const categories = [
    { id: "all", name: "All Events", count: events.length },
    {
      id: "workshop",
      name: "Workshops",
      count: events.filter((e) => e.category === "workshop").length,
    },
    {
      id: "bootcamp",
      name: "Bootcamps",
      count: events.filter((e) => e.category === "bootcamp").length,
    },
    {
      id: "networking",
      name: "Networking",
      count: events.filter((e) => e.category === "networking").length,
    },
    {
      id: "certification",
      name: "Certification",
      count: events.filter((e) => e.category === "certification").length,
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredEvents = events.filter((event) => event.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <section className="pt-20 pb-12">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm mb-6">
                <Calendar className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium text-gray-300">
                  Upcoming Events
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
                Join Our Events
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover amazing workshops, networking opportunities, and
                skill-building sessions designed to accelerate your digital
                marketing journey.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center mb-8">
              <Star className="w-6 h-6 text-yellow-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Featured Events</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {featuredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredCard(event.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl"
                    style={{
                      background: `linear-gradient(135deg, ${
                        event.gradient.split(" ")[1]
                      }, ${event.gradient.split(" ")[3]})`,
                    }}
                  ></div>

                  <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 group-hover:border-white/20 transition-all duration-300 transform group-hover:scale-105">
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${event.gradient} flex items-center justify-center`}
                      >
                        <event.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        {event.attendees}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-300 mb-6 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-3" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="w-4 h-4 mr-3" />
                        {event.location}
                      </div>
                    </div>

                    <button className="w-full group/btn relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <span className="flex items-center justify-center">
                        Register Now
                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Events Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-8">All Events</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredCard(event.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-lg"
                    style={{
                      background: `linear-gradient(135deg, ${
                        event.gradient.split(" ")[1]
                      }, ${event.gradient.split(" ")[3]})`,
                    }}
                  ></div>

                  <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-300 transform group-hover:scale-105 h-full flex flex-col">
                    {event.featured && (
                      <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${event.gradient} flex items-center justify-center`}
                      >
                        <event.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Users className="w-3 h-3 mr-1" />
                        {event.attendees}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-300 mb-4 text-sm flex-grow">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-xs text-gray-400">
                        <Calendar className="w-3 h-3 mr-2" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <MapPin className="w-3 h-3 mr-2" />
                        {event.location}
                      </div>
                    </div>

                    <button className="w-full group/btn px-4 py-2 bg-gradient-to-r from-purple-600/80 to-pink-600/80 rounded-xl font-medium text-white text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                      <span className="flex items-center justify-center">
                        Register
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No events found
                </h3>
                <p className="text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
<<<<<<< HEAD
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/10">
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    Don't Miss Out on
                    <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Amazing Opportunities
                    </span>
                  </h2>
                  <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join our community and stay updated with the latest events,
                    workshops, and networking opportunities.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105">
                      <span className="flex items-center">
                        Join Our Community
                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </button>

                    <button className="group px-8 py-4 border-2 border-purple-500/50 rounded-full font-semibold text-purple-200 hover:bg-purple-500/10 transition-all duration-300 backdrop-blur-sm">
                      <span className="flex items-center">
                        <Calendar className="mr-2 w-5 h-5" />
                        Subscribe to Updates
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
=======
            </CardContent>
            <CardFooter>
                {event.registrationLink ? (
                    <Button asChild className="w-full bg-primary/90 hover:bg-primary">
                        <Link href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                            Register Now
                        </Link>
                    </Button>
                ) : (
                    <Button className="w-full" disabled>
                        Registration Closed
                    </Button>
                )}
            </CardFooter>
          </Card>
        ))}
>>>>>>> 24ff1a9 (in register now i add registration link)
      </div>
    </div>
  );
}
