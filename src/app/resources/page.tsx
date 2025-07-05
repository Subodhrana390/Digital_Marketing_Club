import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  GraduationCap, 
  Link as LinkIcon, 
  Wrench, 
  ExternalLink,
  Sparkles,
  Download,
  BookOpen,
  Star,
  Zap,
  Rocket,
  Target
} from "lucide-react";
import { getResources } from "@/services/resources";

export default async function ResourcesPage() {
  const allResources = await getResources();
  const resources = {
    tools: allResources.filter((r) => r.category === "Tool"),
    templates: allResources.filter((r) => r.category === "Template"),
    learning: allResources.filter((r) => r.category === "Learning"),
  };

  const categoryConfig = {
    tools: {
      icon: Wrench,
      title: "Marketing Tools",
      description: "Powerful tools to streamline your marketing workflow",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      count: resources.tools.length,
      accent: "blue"
    },
    templates: {
      icon: FileText,
      title: "Free Templates",
      description: "Ready-to-use templates for your marketing campaigns",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      count: resources.templates.length,
      accent: "purple"
    },
    learning: {
      icon: GraduationCap,
      title: "Learning Hub",
      description: "Educational resources to boost your marketing skills",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      count: resources.learning.length,
      accent: "green"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></span>
              {allResources.length} Curated Resources
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent font-headline">
              Resource Library
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Your ultimate toolkit for digital marketing success. Discover hand-picked tools, 
              templates, and learning resources to accelerate your growth.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Object.entries(categoryConfig).map(([key, config]) => (
            <Card key={key} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${config.gradient} shadow-lg`}>
                      <config.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{config.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{config.count} resources</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                    {config.count}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {Object.entries(resources).map(([categoryKey, categoryResources]) => {
            const config = categoryConfig[categoryKey];
            return (
              <Card key={categoryKey} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
                <CardHeader className={`bg-gradient-to-r ${config.bgGradient} p-6`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${config.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <config.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {config.title}
                      </CardTitle>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {config.description}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`bg-gradient-to-r ${config.gradient} text-white border-0 shadow-lg`}
                    >
                      {config.count}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    <div className="space-y-1 p-6">
                      {categoryResources.map((resource, index) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/item flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] transform-gpu"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="flex-shrink-0">
                              {categoryKey === 'tools' && <Zap className="h-5 w-5 text-blue-500" />}
                              {categoryKey === 'templates' && <Download className="h-5 w-5 text-purple-500" />}
                              {categoryKey === 'learning' && <BookOpen className="h-5 w-5 text-green-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors truncate">
                                {resource.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {categoryKey === 'tools' && 'Marketing Tool'}
                                {categoryKey === 'templates' && 'Free Download'}
                                {categoryKey === 'learning' && 'Educational Resource'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            <ExternalLink className="h-4 w-4 text-slate-400 group-hover/item:text-blue-500 transition-colors" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-12 text-center text-white">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Rocket className="h-12 w-12" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">Ready to Level Up?</h2>
              <p className="text-lg text-orange-100">
                Join our community and get access to exclusive resources, templates, and tools 
                that will supercharge your marketing efforts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors shadow-lg">
                  Join Community
                </button>
                <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm">
                  Browse More Resources
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed top-32 left-8 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="fixed bottom-32 right-8 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 animate-bounce"></div>
      <div className="fixed top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-15 animate-pulse" style={{animationDelay: '2s'}}></div>
    </div>
  );
}