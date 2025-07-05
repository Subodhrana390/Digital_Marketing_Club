
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Star, Sparkles, Mail, Linkedin, Github, Globe, ArrowRight, Zap, Heart, Award } from "lucide-react";
import { getMembers } from "@/services/members";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Status Badge */}
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-purple-500/30 text-sm font-medium shadow-2xl">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse shadow-lg shadow-green-400/50"></div>
                <Users className="h-5 w-5 text-purple-300" />
              </div>
              <span className="text-white font-semibold">{members.length} Elite Members</span>
            </div>

            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
                OUR TEAM
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
              Meet the <span className="text-purple-400 font-semibold">visionaries</span> and 
              <span className="text-blue-400 font-semibold"> innovators</span> shaping the future of digital experiences
            </p>

            {/* Action Button */}
            <div className="pt-8">
              <button className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/25">
                <span>Join Our Team</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="relative z-10 container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <Card 
              key={member.id}
              className="group relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/25"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Card Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>

              <CardHeader className="flex flex-col items-center text-center relative z-10 pt-8 pb-4">
                {/* Avatar Section */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-0.5 animate-pulse">
                    <div className="bg-slate-900 rounded-full p-2">
                      <Avatar className="h-28 w-28 border-2 border-slate-700 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300">
                        <AvatarImage 
                          src={member.avatarUrl} 
                          alt={member.name}
                          data-ai-hint={member.avatarHint}
                          className="transition-transform duration-500 group-hover:scale-110" 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xl font-bold">
                          {member.fallback}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  {/* Online Status */}
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-xl">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Member Info */}
                <div className="space-y-3">
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-purple-400 font-medium flex items-center justify-center text-sm">
                    <Star className="h-4 w-4 mr-2 fill-purple-400" />
                    {member.role}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="px-6 pb-6 space-y-6">
                {/* Skills Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center text-sm text-slate-400">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Expertise
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.skills.map((skill) => (
                      <Badge 
                        key={skill} 
                        className="px-3 py-1 bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-purple-200 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 text-xs font-medium"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-3 pt-4">
                  {[
                    { icon: Mail, color: "hover:bg-red-500" },
                    { icon: Linkedin, color: "hover:bg-blue-600" },
                    { icon: Github, color: "hover:bg-gray-800" },
                    { icon: Globe, color: "hover:bg-purple-600" }
                  ].map(({ icon: Icon, color }, iconIndex) => (
                    <button 
                      key={iconIndex}
                      className={`w-12 h-12 bg-slate-800/50 ${color} hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-slate-700/50 hover:border-transparent`}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  ))}
                </div>

                {/* Connect Button */}
                <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-105">
                  Connect
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="relative z-10 container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Our Impact</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "150+", label: "Projects Delivered", icon: Award, color: "from-purple-600 to-purple-400" },
            { value: "50+", label: "Happy Clients", icon: Heart, color: "from-pink-600 to-pink-400" },
            { value: "8+", label: "Years Experience", icon: Star, color: "from-blue-600 to-blue-400" },
            { value: "99%", label: "Success Rate", icon: Zap, color: "from-green-600 to-green-400" }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4 mx-auto">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                <stat.icon className="w-8 h-8 text-white relative z-10" />
              </div>
              <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative z-10 container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Work Together?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join our network of talented professionals and be part of something extraordinary.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/25">
            <span>Get In Touch</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
