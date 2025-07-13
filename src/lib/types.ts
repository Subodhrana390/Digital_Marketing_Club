export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  updatedAt?: string;
  category: string;
  imageUrl: string;
  imageHint?: string;
  slug: string;
  readTime: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  session: string;
  registrationLink?: string;
  reportUrl?: string;
  reportName?: string;
  certificateTemplateUrl?: string;
  certificateTemplatePublicId?: string;
  registrationCount?: number;
  bannerUrl?: string;
  bannerHint?: string;
  photos?: string[];
  featured?: boolean;
}

export interface Registration {
  id: string;
  studentName: string;
  studentEmail: string;
  branch: string;
  mobileNumber: string;
  year: "1st" | "2nd" | "3rd" | "4th";
  urn: string;
  crn: string;
  attended: boolean;
  certificateUrl?: string;
}

export interface MemberRegistration {
  id: string;
  studentName: string;
  studentEmail: string;
  branch: string;
  mobileNumber: string;
  year: "1st" | "2nd" | "3rd" | "4th";
  urn: string;
  crn: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  type: 'Core' | 'Active';
  description?: string;
  avatarUrl: string;
  avatarHint?: string;
  fallback: string;
  skills: string[];
  session: string;
  linkedinUrl?: string;
  githubUrl?: string;
  googleUrl?: string;
}

export interface Resource {
    id: string;
    name: string;
    url: string;
    category: 'Tool' | 'Template' | 'Learning';
}
