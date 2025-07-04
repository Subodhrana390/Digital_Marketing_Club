import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, GraduationCap, Link as LinkIcon, Wrench } from "lucide-react";
import { getResources } from "@/services/resources";

export default async function ResourcesPage() {
  const allResources = await getResources();
  const resources = {
    tools: allResources.filter((r) => r.category === "Tool"),
    templates: allResources.filter((r) => r.category === "Template"),
    learning: allResources.filter((r) => r.category === "Learning"),
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Resource Library</h1>
        <p className="text-lg text-muted-foreground">
          A curated collection of tools, templates, and learning materials to help you succeed.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium hover:no-underline">
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-primary" />
                Marketing Tools
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pl-6 pt-2">
                {resources.tools.map((tool) => (
                  <li key={tool.id}>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                       <LinkIcon className="h-4 w-4 text-accent group-hover:text-primary transition-colors" />
                      {tool.name}
                    </a>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium hover:no-underline">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                Free Templates
              </div>
            </AccordionTrigger>
            <AccordionContent>
               <ul className="space-y-3 pl-6 pt-2">
                {resources.templates.map((template) => (
                  <li key={template.id}>
                    <a href={template.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                       <LinkIcon className="h-4 w-4 text-accent group-hover:text-primary transition-colors" />
                      {template.name}
                    </a>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium hover:no-underline">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                Learning Hub
              </div>
            </AccordionTrigger>
            <AccordionContent>
               <ul className="space-y-3 pl-6 pt-2">
                {resources.learning.map((resource) => (
                  <li key={resource.id}>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                      <LinkIcon className="h-4 w-4 text-accent group-hover:text-primary transition-colors" />
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
