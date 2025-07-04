export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  imageHint?: string;
  slug: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  avatarHint?: string;
  fallback: string;
  skills: string[];
}

export interface Resource {
    id: string;
    name: string;
    url: string;
    category: 'Tool' | 'Template' | 'Learning';
}
