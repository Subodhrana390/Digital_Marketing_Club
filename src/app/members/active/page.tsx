
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Users, UserCheck } from "lucide-react";
import { getMembers } from "@/services/members";
import type { Member } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


const LoadingSkeletons = () => (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/10">
                        <TableHead className="text-white">Name</TableHead>
                        <TableHead className="text-white">Role</TableHead>
                        <TableHead className="text-white">Branch</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                         <TableRow key={i} className="border-white/10 hover:bg-white/10">
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);


export default function ActiveMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      setIsLoading(true);
      const fetchedMembers = await getMembers('Active');
      setMembers(fetchedMembers);

      if (fetchedMembers.length > 0) {
        const allSessions = [...new Set(fetchedMembers.map(m => m.session).filter(Boolean))].sort((a,b) => b.localeCompare(a));
        setSelectedSession(allSessions[0] || null);
      }
      setIsLoading(false);
    }
    fetchMembers();
  }, []);
  
  const { allSessions, activeMembers } = useMemo(() => {
      if (members.length === 0) {
          return { allSessions: [], activeMembers: [] };
      }
      const sessions = [...new Set(members.map(m => m.session).filter(Boolean))].sort((a,b) => b.localeCompare(a));
      const filtered = selectedSession ? members.filter(m => m.session === selectedSession) : [];
      
      return { allSessions: sessions, activeMembers: filtered };
  }, [members, selectedSession]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-sky-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                <UserCheck className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-white font-semibold">Active Team</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-green-200 to-teal-200 bg-clip-text text-transparent leading-tight font-headline">
                Our Active Members
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              The backbone of our club's operations. These are the passionate creators and marketers who make it all happen.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
        <div className="max-w-xs mx-auto">
            <Select onValueChange={setSelectedSession} value={selectedSession ?? ""}>
              <SelectTrigger className="w-full bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300">
                <SelectValue placeholder="Select a session..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-green-500/30 text-white">
                {allSessions.map(session => (
                  <SelectItem key={session} value={session} className="cursor-pointer">Team {session}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
        
        <div className="max-w-4xl mx-auto">
            {isLoading ? (
                <LoadingSkeletons />
            ) : (activeMembers.length > 0) ? (
                <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-white/10">
                                    <TableHead className="text-white">Name</TableHead>
                                    <TableHead className="text-white">Role</TableHead>
                                    <TableHead className="text-white">Branch</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeMembers.map((member) => (
                                    <TableRow key={member.id} className="border-white/10 hover:bg-white/10">
                                        <TableCell className="font-medium text-slate-200">{member.name}</TableCell>
                                        <TableCell className="text-slate-400">{member.role}</TableCell>
                                        <TableCell className="text-slate-400">{member.branch}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No members found</h3>
                    <p className="text-gray-400">Active Team members for the selected session will be displayed here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
