import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/services/events";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Camera,
} from "lucide-react";

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.date);
  const isPast = eventDate < today;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/events"
          className="inline-flex items-center text-purple-300 hover:text-white transition-colors group mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to All Events
        </Link>

        <div className="relative h-64 md:h-96 w-full rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 mb-8">
          {event.bannerUrl ? (
            <Image
              src={event.bannerUrl}
              alt={`${event.title} banner`}
              fill
              className="object-cover"
              data-ai-hint={event.bannerHint}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <h2 className="text-4xl font-bold">Event Banner</h2>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2 space-y-8">
            {/* Event Title and Date */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-purple-300">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-4">About this Event</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Photo Gallery */}
            {event.photos && event.photos.length > 0 && (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Camera className="h-6 w-6" />
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <Image
                        src={photo}
                        alt={`Event photo ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 sticky top-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-purple-300" />
                <span className="text-lg font-semibold">
                  {event.registrationCount ?? 0} Attendees
                </span>
              </div>

              {isPast ? (
                <Button size="lg" className="w-full" disabled>
                  Registration Closed
                </Button>
              ) : event.registrationLink ? (
                <Button size="lg" asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                    <Ticket className="mr-2 h-5 w-5" />
                    Register Now
                  </a>
                </Button>
              ) : (
                <Button size="lg" className="w-full" disabled>
                  Registration Not Available
                </Button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
