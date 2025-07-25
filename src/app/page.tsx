
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clapperboard,
  Feather,
  Palette,
  Camera,
  Users,
  Eye,
  Calendar,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Quote,
  GraduationCap,
  Newspaper,
  PartyPopper,
  Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MemberRegistrationForm } from "@/components/member-registration-form";
import { getTestimonials } from "@/services/testimonials";
import { getBlogPosts } from "@/services/blogs";
import { getEvents } from "@/services/events";
import { getActiveAnnouncement } from "@/services/announcements";
import { Badge } from "@/components/ui/badge";


const services = [
  {
    icon: Clapperboard,
    title: "Reels & Video Editing",
    description:
      "Crafting viral-worthy short-form videos and professional event coverage.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Feather,
    title: "Content Writing",
    description:
      "Engaging articles, social media captions, and compelling ad copy.",
    color: "from-sky-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "Graphic Designing",
    description: "Eye-catching posters, logos, and social media graphics.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Camera,
    title: "Event Coverage",
    description:
      "Professional photography and videography for all college events.",
    color: "from-amber-500 to-orange-500",
  },
];

const stats = [
  { icon: Calendar, number: "50+", label: "Events Covered" },
  { icon: Eye, number: "10K+", label: "Social Views" },
  { icon: Users, number: "20+", label: "Active Creators" },
];

const featuredProjects = [
  {
    type: "photo",
    src: "https://placehold.co/600x400.png",
    hint: "college event",
    title: "Annual Tech Fest",
    category: "Photography",
  },
  {
    type: "video",
    src: "https://placehold.co/600x400.png",
    hint: "students dancing",
    title: "Freshers Party Reel",
    category: "Video Reel",
  },
  {
    type: "design",
    src: "https://placehold.co/600x400.png",
    hint: "marketing poster",
    title: "Marketing Workshop Poster",
    category: "Graphic Design",
  },
  {
    type: "photo",
    src: "https://placehold.co/600x400.png",
    hint: "sports competition",
    title: "Sports Day Highlights",
    category: "Photography",
  },
  {
    type: "video",
    src: "https://placehold.co/600x400.png",
    hint: "graduation ceremony",
    title: "Convocation Ceremony",
    category: "Videography",
  },
  {
    type: "design",
    src: "https://placehold.co/600x400.png",
    hint: "club logo",
    title: "Debate Club Logo",
    category: "Graphic Design",
  },
];

export default async function HomePage() {
  const testimonials = await getTestimonials();
  const allPosts = await getBlogPosts();
  const allEvents = await getEvents();
  const activeAnnouncement = await getActiveAnnouncement();

  const latestPosts = allPosts.slice(0, 3);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = allEvents
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Background Gradient Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d53f8c,transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_0%_400px,#8b5cf6,transparent)]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen items-center py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Where Creativity
              </span>
              <br />
              Meets Strategy
            </h1>
            <p className="mt-6 text-lg text-slate-300 sm:text-xl">
              Empowering the next wave of digital creators in marketing, media,
              and design at GNDEC, Ludhiana.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Dialog>
                 <DialogTrigger asChild>
                    <Button size="lg">
                      Get Involved <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-slate-900 border-purple-500/30 text-white">
                    <DialogHeader>
                        <DialogTitle>Join the Digital Marketing Club</DialogTitle>
                        <DialogDescription>Fill out your details below to start your journey with us.</DialogDescription>
                    </DialogHeader>
                    <MemberRegistrationForm />
                </DialogContent>
              </Dialog>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-purple-400 text-purple-300 hover:bg-purple-500/20 hover:text-white">
                <Link href="/blog">
                  See Our Work
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement Section */}
      {activeAnnouncement && (
        <section className="relative z-10 py-20 -mt-24">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 p-8 border border-white/10 backdrop-blur-md">
              <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-20 blur-2xl"></div>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
                  <Megaphone className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-white mb-1">
                    Latest Announcement
                  </h3>
                  <p className="text-slate-300">
                    {activeAnnouncement.message}
                  </p>
                </div>
                {activeAnnouncement.link && (
                  <Button asChild>
                    <Link href={activeAnnouncement.link} target="_blank" rel="noopener noreferrer">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* What We Do Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">What We Do</h2>
            <p className="mt-4 text-slate-400">
              We are a team of storytellers, designers, and strategists passionate
              about bringing ideas to life.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-slate-800/50 p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div
                  className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-bl ${service.color} opacity-20 blur-2xl transition-all duration-500 group-hover:h-32 group-hover:w-32 group-hover:opacity-30`}
                ></div>
                <div
                  className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-white`}
                >
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{service.title}</h3>
                <p className="text-slate-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Impact Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white/5 p-8 backdrop-blur-sm"
              >
                <stat.icon className="mx-auto mb-4 h-12 w-12 text-purple-400" />
                <div className="text-4xl font-bold">{stat.number}</div>
                <p className="mt-1 text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Latest Updates</h2>
            <p className="mt-4 text-slate-400">
              Stay in the loop with our latest articles and upcoming events.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Latest Articles */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
                <Newspaper className="text-sky-400" />
                From the Blog
              </h3>
              <div className="space-y-4">
                {latestPosts.map(post => (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
                    <div className="bg-white/5 p-4 rounded-xl border border-transparent hover:border-sky-500/50 hover:bg-white/10 transition-all duration-300">
                       <p className="text-sm text-slate-400 mb-1">{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</p>
                      <h4 className="font-semibold text-white group-hover:text-sky-300 transition-colors">{post.title}</h4>
                      <p className="text-sm text-slate-400 line-clamp-2 mt-1">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Button asChild variant="link" className="text-sky-400 p-0">
                <Link href="/blog">Read all articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            
            {/* Upcoming Events */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
                <PartyPopper className="text-pink-400" />
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <Link href={`/events/${event.id}`} key={event.id} className="block group">
                    <div className="bg-white/5 p-4 rounded-xl border border-transparent hover:border-pink-500/50 hover:bg-white/10 transition-all duration-300">
                      <div className="flex justify-between items-center text-sm text-slate-400 mb-1">
                        <span>{new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
                        <span>{event.time}</span>
                      </div>
                      <h4 className="font-semibold text-white group-hover:text-pink-300 transition-colors">{event.title}</h4>
                       <p className="text-sm text-slate-400 mt-1">{event.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
               <Button asChild variant="link" className="text-pink-400 p-0">
                <Link href="/events">See all events <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Projects Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Featured Projects</h2>
            <p className="mt-4 text-slate-400">
              A glimpse into the creative work we do for college events and
              initiatives.
            </p>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProjects.map((project, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="group relative overflow-hidden rounded-2xl">
                    <Image
                      src={project.src}
                      alt={project.title}
                      width={600}
                      height={400}
                      data-ai-hint={project.hint}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <span className="text-sm font-semibold uppercase tracking-wider text-purple-300">
                        {project.category}
                      </span>
                      <h3 className="mt-1 text-xl font-bold">{project.title}</h3>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 transform text-white bg-slate-800/50 hover:bg-slate-700/80 border-slate-700" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 transform text-white bg-slate-800/50 hover:bg-slate-700/80 border-slate-700" />
          </Carousel>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
           <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">What People Say</h2>
            <p className="mt-4 text-slate-400">
                Hear from our members, collaborators, and faculty about their experience with the club.
            </p>
          </div>
           <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
             {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="rounded-2xl bg-white/5 p-8 backdrop-blur-sm flex flex-col">
                    <Quote className="w-10 h-10 text-purple-400/50 mb-4" />
                    <p className="text-slate-300 italic mb-6 flex-grow">"{testimonial.quote}"</p>
                    <div className="flex items-center mt-auto">
                        <Avatar className="h-12 w-12 mr-4">
                            <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-bold text-white">{testimonial.name}</h4>
                            <p className="text-sm text-slate-400">{testimonial.role}</p>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-12 text-center shadow-2xl shadow-purple-500/30">
             <div className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
            </div>
            <div className="relative z-10">
                <h2 className="text-4xl font-bold">Ready to Create?</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-purple-100">
                Join our vibrant community of marketers, designers, and content
                creators. Let's build something amazing together.
                </p>
                <div className="mt-8">
                <Dialog>
                   <DialogTrigger asChild>
                    <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg">
                        Join the Club Now <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-slate-900 border-purple-500/30 text-white">
                      <DialogHeader>
                          <DialogTitle>Join the Digital Marketing Club</DialogTitle>
                          <DialogDescription>Fill out your details below to start your journey with us.</DialogDescription>
                      </DialogHeader>
                      <MemberRegistrationForm />
                  </DialogContent>
                </Dialog>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-900/50 py-12">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* Column 1: Logos and Info */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center space-x-4">
                        <Image src="/images/logo.png" alt="DMC Logo" width={60} height={60} />
                        <Image src="/images/gndec.png" alt="GNDEC Logo" width={60} height={60} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Digital Marketing Club</h3>
                    <p className="text-sm text-slate-400">
                        Guru Nanak Dev Engineering College<br/>
                        Ludhiana, Punjab 141006
                    </p>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-slate-200">Follow Us</h4>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-slate-400 hover:text-white"><Facebook/></Link>
                            <Link href="#" className="text-slate-400 hover:text-white"><Instagram/></Link>
                            <Link href="#" className="text-slate-400 hover:text-white"><Linkedin/></Link>
                            <Link href="#" className="text-slate-400 hover:text-white"><Youtube/></Link>
                        </div>
                    </div>
                </div>

                {/* Column 2: Club Links */}
                <div>
                    <h4 className="font-semibold text-slate-200 mb-4">Club</h4>
                    <ul className="space-y-3">
                        <li><Link href="/" className="text-slate-400 hover:text-white">Home</Link></li>
                        <li><Link href="/events" className="text-slate-400 hover:text-white">Events</Link></li>
                        <li><Link href="/contact" className="text-slate-400 hover:text-white">Contact</Link></li>
                    </ul>
                </div>

                {/* Column 3: Content Links */}
                <div>
                    <h4 className="font-semibold text-slate-200 mb-4">Content</h4>
                     <ul className="space-y-3">
                        <li><Link href="/blog" className="text-slate-400 hover:text-white">Blog</Link></li>
                        <li><Link href="/resources" className="text-slate-400 hover:text-white">Resources</Link></li>
                        <li><Link href="/ideation-tool" className="text-slate-400 hover:text-white">Ideation Tool</Link></li>
                    </ul>
                </div>
                 {/* Column 4: Team Links */}
                <div>
                    <h4 className="font-semibold text-slate-200 mb-4">Team</h4>
                     <ul className="space-y-3">
                        <li><Link href="/members/core" className="text-slate-400 hover:text-white">Core Team</Link></li>
                        <li><Link href="/members/active" className="text-slate-400 hover:text-white">Active Team</Link></li>
                        <li><Link href="/members/faculty" className="text-slate-400 hover:text-white">Faculty</Link></li>
                         <li><Link href="/reports" className="text-slate-400 hover:text-white">Public Reports</Link></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
                <p>© {new Date().getFullYear()} Digital Marketing Club. All Rights Reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
