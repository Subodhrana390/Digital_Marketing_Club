import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getMembers } from "@/services/members";
import { Users, Star, Sparkles, Mail, Linkedin, Github, Globe } from "lucide-react";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
              <Users className="h-4 w-4 mr-2" />
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {members.length} Active Members
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent font-headline">
              Meet Our Team
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The passionate innovators, creative thinkers, and digital marketing experts 
              who make our community thrive and push boundaries every day.
            </p>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member, index) => (
            <Card 
              key={member.id} 
              className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:rotate-1 transform-gpu"
            >
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-15 group-hover:opacity-30 transition-opacity duration-300"></div>

              <CardHeader className="flex flex-col items-center text-center relative z-10 pt-8">
                {/* Avatar with Glow Effect */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1 animate-pulse">
                    <div className="bg-white dark:bg-slate-800 rounded-full p-1">
                      <Avatar className="h-24 w-24 border-2 border-white shadow-xl">
                        <AvatarImage 
                          src={member.avatarUrl} 
                          alt={member.name} 
                          data-ai-hint={member.avatarHint}
                          className="transition-transform duration-300 group-hover:scale-110" 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-lg font-bold">
                          {member.fallback}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Name and Role */}
                <div className="space-y-2">
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Star className="h-4 w-4 mr-1" />
                    {member.role}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="px-6 pb-6 space-y-6">
                {/* Skills */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center text-sm text-slate-600 dark:text-slate-400">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Skills & Expertise
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.skills.map((skill, skillIndex) => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="text-xs px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 border-0 hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-800/50 dark:hover:to-blue-800/50 transition-all duration-200 cursor-default"
                        style={{
                          animationDelay: `${skillIndex * 0.1}s`
                        }}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button className="w-10 h-10 bg-slate-100 dark:bg-slate-700 hover:bg-blue-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="w-10 h-10 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
                    <Linkedin className="h-4 w-4" />
                  </button>
                  <button className="w-10 h-10 bg-slate-100 dark:bg-slate-700 hover:bg-slate-800 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
                    <Github className="h-4 w-4" />
                  </button>
                  <button className="w-10 h-10 bg-slate-100 dark:bg-slate-700 hover:bg-purple-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
                    <Globe className="h-4 w-4" />
                  </button>
                </div>

                {/* Connect Button */}
                <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 transform">
                  Connect
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Stats Section */}
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">50+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">25+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Clients Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">5+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">100%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-10 animate-bounce"></div>
      <div className="fixed top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
    </div>
  );
}