import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const members = [
  {
    name: "Alex Morgan",
    role: "President",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "professional headshot",
    fallback: "AM",
    skills: ["Leadership", "Public Speaking", "Strategy"],
  },
  {
    name: "Brenda Chen",
    role: "Vice President, Events",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "professional headshot",
    fallback: "BC",
    skills: ["Event Planning", "Content Creation", "SEO"],
  },
  {
    name: "Carlos Rodriguez",
    role: "Vice President, Marketing",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "professional headshot",
    fallback: "CR",
    skills: ["Social Media", "Graphic Design", "PPC"],
  },
  {
    name: "Diana Wells",
    role: "Treasurer",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "professional headshot",
    fallback: "DW",
    skills: ["Finance", "Analytics", "Email Marketing"],
  },
    {
    name: "Ethan Hunt",
    role: "Member",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "professional headshot",
    fallback: "EH",
    skills: ["Content Writing", "SEO", "WordPress"],
  },
  {
    name: "Fiona Gallagher",
    role: "Member",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "professional headshot",
    fallback: "FG",
    skills: ["Videography", "Community Management"],
  },
];

export default function MembersPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Meet Our Members</h1>
        <p className="text-lg text-muted-foreground">
          The talented individuals driving the Digital Marketing Club forward.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.name} className="text-center transition-shadow duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.avatarHint} />
                <AvatarFallback>{member.fallback}</AvatarFallback>
              </Avatar>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription className="text-primary">{member.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-2">
                {member.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
