
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getEvents } from "@/services/events";
import type { Event as EventType } from "@/lib/types";
import { Calendar, Clock, MapPin, Users, Star, ArrowRight, Filter, Search, Zap, Award, TrendingUp, Globe, XCircle, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to add UI-specific properties to the event data
const categoryMap: { [key: string]: { icon: React.ElementType; gradient: string } } = {
  workshop: { icon: TrendingUp, gradient: "from-blue-500 to-purple-600" },
  bootcamp: { icon: Globe, gradient: "from-pink-500 to-red-600" },
  networking: { icon: Users, gradient: "from-purple-500 to-pink-600" },
  certification: { icon: Award, gradient: "from-orange-500 to-red-600" },
  other: { icon: Zap, gradient: "from-green-500 to-teal-600" },
};

const allCategories = ["workshop", "bootcamp", "networking", "certification", "other"];

type AugmentedEvent = EventType & {
  category: string;
  icon: React.ElementType;
  gradient: string;
};


const augmentEventData = (event: EventType, index: number): AugmentedEvent => {
  const category = allCategories[index % allCategories.length];
  return {
    ...event,
    category: category,
    icon: categoryMap[category].icon,
    gradient: categoryMap[category].gradient,
  };
};

const EventCard = ({ event, isPast }: { event: AugmentedEvent, isPast: boolean }) => {
  return (
    <div className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
      {event.featured && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <Star className="w-5 h-5 text-white" />
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${event.gradient} flex items-center justify-center`}>
          <event.icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <Users className="w-4 h-4 mr-1" />
          {event.registrationCount ?? 0}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-3 flex-grow">{event.title}</h3>
      <div className="space-y-3 mb-6 text-sm text-gray-400">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-3" />
          {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-3" />
          {event.location}
        </div>
      </div>
      {isPast ? (
        <button disabled className="w-full mt-auto group/btn px-4 py-2 bg-gray-600/50 rounded-xl font-medium text-gray-300 text-sm cursor-not-allowed flex items-center justify-center">
          <XCircle className="mr-2 w-4 h-4" />
          Event Concluded
        </button>
      ) : (
        <Link href={`/events/${event.id}`} className="w-full mt-auto block">
          <button className="w-full group/btn px-4 py-2 bg-gradient-to-r from-purple-600/80 to-pink-600/80 rounded-xl font-medium text-white text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
            View Details
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </Link>
      )}
    </div>
  )
}

const LoadingSkeletons = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <Skeleton className="w-10 h-6 rounded-md" />
                </div>
                <Skeleton className="h-8 w-3/4 rounded-md" />
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-6 w-1/2 rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl mt-4" />
            </div>
        ))}
    </div>
);


export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<AugmentedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      try {
        const fetchedEvents = await getEvents();
        const augmentedEvents = fetchedEvents.map(augmentEventData);
        setAllEvents(augmentedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);
  
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allEvents, searchTerm]);

  const { featuredEvents, upcomingEvents, pastEvents } = useMemo(() => {
      const featured = filteredEvents.filter(e => e.featured && new Date(e.date) >= today);
      const upcoming = filteredEvents.filter(e => !e.featured && new Date(e.date) >= today);
      const past = filteredEvents.filter(e => new Date(e.date) < today);

      upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return { featuredEvents: featured, upcomingEvents: upcoming, pastEvents: past };
  }, [filteredEvents, today]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <section className="pt-20 pb-12">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
               <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm mb-6">
                <Calendar className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium text-gray-300">Our Events</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
                Join Our Community
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover amazing workshops, networking opportunities, and skill-building sessions designed to accelerate your digital marketing journey.
              </p>
            </div>

            <div className="max-w-md mx-auto mb-12">
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
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 space-y-16 pb-20">
            {isLoading ? (
                <div>
                    <Skeleton className="h-10 w-64 mb-8 rounded-lg" />
                    <LoadingSkeletons />
                </div>
            ) : (
                <>
                    {featuredEvents.length > 0 && (
                        <section>
                            <div className="flex items-center mb-8">
                                <Star className="w-8 h-8 text-yellow-400 mr-4" />
                                <h2 className="text-3xl font-bold text-white">Featured Events</h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredEvents.map((event) => <EventCard key={event.id} event={event} isPast={false} />)}
                            </div>
                        </section>
                    )}

                    {upcomingEvents.length > 0 && (
                        <section>
                             <div className="flex items-center mb-8">
                                <Trophy className="w-8 h-8 text-green-400 mr-4" />
                                <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {upcomingEvents.map((event) => <EventCard key={event.id} event={event} isPast={false} />)}
                            </div>
                        </section>
                    )}

                    {pastEvents.length > 0 && (
                        <section>
                            <div className="flex items-center mb-8">
                                <Clock className="w-8 h-8 text-gray-400 mr-4" />
                                <h2 className="text-3xl font-bold text-gray-300">Past Events</h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {pastEvents.map((event) => <EventCard key={event.id} event={event} isPast={true} />)}
                            </div>
                        </section>
                    )}

                    {filteredEvents.length === 0 && !isLoading && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
                            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </>
            )}
        </div>
      </div>
    </div>
  );
}
