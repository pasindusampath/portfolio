export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[]; // Stored as comma-separated string in Sheets
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
  createdAt: string;
}

export interface Profile {
  name: string;
  role: string;
  bio: string;
  email: string;
  avatarUrl: string;
  socials: {
    github: string;
    linkedin: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
}

export interface Skill {
  category: string;
  items: string[];
}
