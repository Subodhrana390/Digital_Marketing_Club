
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Filter, Sparkles, Loader2, Linkedin, Github, Swords, ShieldCheck, UserCheck } from "lucide-react";
import { getMembers } from "@/services/members";
import type { Member } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SocialIcon = ({ type, url }: { type: 'linkedin' | 'github' | 'google', url: string }) => {
    const commonClasses = "w-6 h-6 text-gray-400 hover:text-white transition-colors";
    
    if(type === 'linkedin') {
        return <Link href={url} target="_blank" rel="noopener noreferrer"><Linkedin className={commonClasses} /></Link>
    }
    if(type === 'github') {
        return <Link href={url} target="_blank" rel="noopener noreferrer"><Github className={commonClasses} /></Link>
    }
    if(type === 'google') {
        return (
            <Link href={url} target="_blank" rel="noopener noreferrer">
                <svg className={commonClasses} viewBox="0 0 488 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C307.4 99.4 280.7 86 248 86c-84.3 0-152.3 68.3-152.3 152S163.7 384 248 384c87.7 0 140.2-61.9 144-131.6H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.8z"></path></svg>
            </Link>
        )
    }
    return null;
}

const CoreMemberCard = ({ member }: { member: Member }) => (
  <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2 group h-full flex flex-col">
    <div className="flex flex-col items-center text-center">
      <Avatar className="w-28 h-28 mb-4 border-4 border-purple-500/30 group-hover:border-purple-500/80 transition-all duration-300">
        <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.avatarHint} />
        <AvatarFallback>{member.fallback}</AvatarFallback>
      </Avatar>
      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
      <p className="text-purple-300 font-medium mb-4">{member.role}</p>
      {member.description && (
        <p className="text-gray-400 text-sm mb-4 min-h-[40px] flex-grow">{member.description}</p>
      )}
    </div>
    <div className="mt-auto space-y-4">
        <div className="flex flex-wrap justify-center gap-2">
            {member.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-white/10 text-purple-300 border-purple-500/30">
                {skill}
            </Badge>
            ))}
        </div>
        <div className="flex justify-center items-center gap-4 pt-4 border-t border-white/10">
            {member.linkedinUrl && <SocialIcon type="linkedin" url={member.linkedinUrl} />}
            {member.githubUrl && <SocialIcon type="github" url={member.githubUrl} />}
            {member.googleUrl && <SocialIcon type="google" url={member.googleUrl} />}
        </div>
    </div>
  </div>
);

const LoadingSkeletons = () => (
    <div className="space-y-16">
        <section>
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
    </div>
);


export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      setIsLoading(true);
      const fetchedMembers = await getMembers();
      setMembers(fetchedMembers);

      if (fetchedMembers.length > 0) {
        const allSessions = [...new Set(fetchedMembers.map(m => m.session).filter(Boolean))].sort((a,b) => b.localeCompare(a));
        setSelectedSession(allSessions[0] || null);
      }
      setIsLoading(false);
    }
    fetchMembers();
  }, []);
  
  const { allSessions, coreMembers, activeMembers } = useMemo(() => {
      if (members.length === 0) {
          return { allSessions: [], coreMembers: [], activeMembers: [] };
      }
      const sessions = [...new Set(members.map(m => m.session).filter(Boolean))].sort((a,b) => b.localeCompare(a));
      const filtered = selectedSession ? members.filter(m => m.session === selectedSession) : [];
      
      const core = filtered.filter(m => m.type === 'Core');
      const active = filtered.filter(m => m.type === 'Active');

      return { allSessions: sessions, coreMembers: core, activeMembers: active };
  }, [members, selectedSession]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                <Users className="h-5 w-5 text-purple-300 mr-2" />
                <span className="text-white font-semibold">{members.length} Total Members</span>
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
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
        <div className="max-w-xs mx-auto">
            <Select onValueChange={setSelectedSession} value={selectedSession ?? ""}>
              <SelectTrigger className="w-full bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300">
                <SelectValue placeholder="Select a session..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-purple-500/30 text-white">
                {allSessions.map(session => (
                  <SelectItem key={session} value={session} className="cursor-pointer">Team {session}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
        {isLoading ? (
            <LoadingSkeletons />
        ) : (coreMembers.length > 0 || activeMembers.length > 0) ? (
              <div className="space-y-16">
                {coreMembers.length > 0 && (
                    <section>
                         <h2 className="text-3xl font-bold text-center mb-10 text-white flex items-center justify-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-cyan-400" />
                            Core Members
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {coreMembers.map((member) => (
                                <CoreMemberCard key={member.id} member={member} />
                            ))}
                        </div>
                    </section>
                )}
                {activeMembers.length > 0 && (
                     <section>
                         <h2 className="text-3xl font-bold text-center mb-10 text-white flex items-center justify-center gap-3">
                            <UserCheck className="w-8 h-8 text-green-400" />
                            Active Members
                        </h2>
                        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10 hover:bg-white/10">
                                            <TableHead className="text-white">Name</TableHead>
                                            <TableHead className="text-white">Role</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activeMembers.map((member) => (
                                            <TableRow key={member.id} className="border-white/10 hover:bg-white/10">
                                                <TableCell className="font-medium text-slate-200">{member.name}</TableCell>
                                                <TableCell className="text-slate-400">{member.role}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </section>
                )}
              </div>
        ) : (
             <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No members found</h3>
                <p className="text-gray-400">Team members for the selected session will be displayed here.</p>
            </div>
        )}
      </div>
    </div>
  );
}
