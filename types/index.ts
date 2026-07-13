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

export interface User {
    id: string;
    email: string;
    passwordHash: string;
    role: string;
}

export interface AuthToken {
    tokenId: string;
    userId: string;
    deviceId: string;
    expiresAt: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Footprint {
  id: string;
  deviceId: string;
  name: string;
  emoji: string;
  message?: string;
  color: string; // Theme/color class or identifier
  x: number; // Percentage X coordinate (0-100)
  y: number; // Percentage Y coordinate (0-100)
  country?: string;
  city?: string;
  createdAt: string;
}

