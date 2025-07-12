
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Filter, Sparkles, Loader2 } from "lucide-react";
import { getMembers } from "@/services/members";
import type { Member } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';

const MemberCard = ({ member }: { member: Member }) => (
  <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2 group h-full flex flex-col">
    <div className="flex flex-col items-center text-center">
      <Avatar className="w-28 h-28 mb-4 border-4 border-purple-500/30 group-hover:border-purple-500/80 transition-all duration-300">
        <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.avatarHint} />
        <AvatarFallback>{member.fallback}</AvatarFallback>
      </Avatar>
      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
      <p className="text-purple-300 font-medium mb-4">{member.role}</p>
      {member.description && (
        <p className="text-gray-400 text-sm mb-4 min-h-[40px] line-clamp-2">{member.description}</p>
      )}
      <div className="flex flex-wrap justify-center gap-2 mt-auto">
        {member.skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="bg-white/10 text-purple-300 border-purple-500/30">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  </div>
);

const LoadingSkeletons = () => (
    <div className="space-y-16">
        {[...Array(2)].map((_, i) => (
            <section key={i}>
                <Skeleton className="h-10 w-48 mb-8 mx-auto" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, j) => (
                        <div key={j} className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col items-center text-center">
                            <Skeleton className="w-28 h-28 rounded-full mb-4" />
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-5 w-1/2 mb-4" />
                            <div className="flex flex-wrap justify-center gap-2 mt-auto w-full">
                                <Skeleton className="h-6 w-1/4" />
                                <Skeleton className="h-6 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        ))}
    </div>
);


export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState('all');

  useEffect(() => {
    async function fetchMembers() {
      setIsLoading(true);
      const fetchedMembers = await getMembers();
      setMembers(fetchedMembers);
      setIsLoading(false);
    }
    fetchMembers();
  }, []);

  const { sessions, filteredMembers } = useMemo(() => {
      const allSessions = [...new Set(members.map(m => m.session).filter(Boolean))].sort((a,b) => b.localeCompare(a));
      
      const filtered = selectedSession === 'all' 
          ? members 
          : members.filter(member => member.session === selectedSession);

      return { sessions: allSessions, filteredMembers: filtered };
  }, [members, selectedSession]);
  
  const groupedMembers = useMemo(() => {
    return filteredMembers.reduce((acc, member) => {
      const session = member.session || 'Uncategorized';
      if (!acc[session]) {
        acc[session] = [];
      }
      acc[session].push(member);
      return acc;
    }, {} as Record<string, Member[]>);
  }, [filteredMembers]);

  const sortedSessions = Object.keys(groupedMembers).sort((a, b) => {
      if (a === 'Uncategorized') return 1;
      if (b === 'Uncategorized') return -1;
      return b.localeCompare(a);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10"></div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                <Users className="h-5 w-5 text-purple-300 mr-2" />
                <span className="text-white font-semibold">{members.length} Active Members</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight font-headline">
                Meet Our Team
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            </div>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              The driving force behind our club's success. Meet the dedicated individuals who bring passion and expertise to everything we do.
            </p>

             <div className="max-w-xs mx-auto">
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger className="w-full bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-gray-400 focus:ring-purple-500/50">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by session..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-purple-500/30 text-white">
                    <SelectItem value="all">All Sessions</SelectItem>
                    {sessions.map(session => (
                        <SelectItem key={session} value={session}>{session}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
        {isLoading ? (
            <LoadingSkeletons />
        ) : sortedSessions.length > 0 ? (
          sortedSessions.map(session => (
              <section key={session}>
                   <h2 className="text-3xl font-bold text-center text-white mb-8 border-b-2 border-purple-500/30 pb-4">
                      Team {session}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {groupedMembers[session].map((member) => (
                          <MemberCard key={member.id} member={member} />
                      ))}
                  </div>
              </section>
          ))
        ) : (
             <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No members found</h3>
                <p className="text-gray-400">Try adjusting your session filter.</p>
            </div>
        )}
      </div>
    </div>
  );
}
