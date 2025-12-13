import { google } from 'googleapis';
import { Project, Profile, Skill } from '@/types';

// Constants for Sheet Tab Names
const SHEET_PROJECTS = 'Projects';
const SHEET_PROFILE = 'Profile';
const SHEET_SKILLS = 'Skills';

const GL_AUTH = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth: GL_AUTH });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_PROJECTS}!A2:I`, // Assuming row 1 is header
    });

    const rows = response.data.values || [];
    
    return rows.map((row) => ({
      id: row[0] || '',
      title: row[1] || '',
      description: row[2] || '',
      imageUrl: row[3] || '',
      technologies: row[4] ? row[4].split(',').map((t: string) => t.trim()) : [],
      demoUrl: row[5] || '',
      repoUrl: row[6] || '',
      featured: row[7] === 'TRUE',
      createdAt: row[8] || '',
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_PROFILE}!A2:B`, // Key-Value pairs
    });

    const rows = response.data.values || [];
    const profileMap: Record<string, string> = {};
    
    rows.forEach(([key, value]) => {
      if (key) profileMap[key] = value || '';
    });

    return {
      name: profileMap['name'] || '',
      role: profileMap['role'] || '',
      bio: profileMap['bio'] || '',
      email: profileMap['email'] || '',
      avatarUrl: profileMap['avatarUrl'] || '',
      socials: {
        github: profileMap['github'] || '',
        linkedin: profileMap['linkedin'] || '',
        twitter: profileMap['twitter'] || '',
        facebook: profileMap['facebook'] || '',
        instagram: profileMap['instagram'] || '',
        website: profileMap['website'] || '',
      },
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_SKILLS}!A2:B`,
    });

    const rows = response.data.values || [];
    
    return rows.map((row) => ({
      category: row[0] || '',
      items: row[1] ? row[1].split(',').map((s: string) => s.trim()) : [],
    }));
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

// Add function to append a new project (for Admin)
export async function addProject(project: Partial<Project>): Promise<boolean> {
  try {
    const values = [
      [
        project.id || Date.now().toString(),
        project.title || '',
        project.description || '',
        project.imageUrl || '',
        project.technologies?.join(', ') || '',
        project.demoUrl || '',
        project.repoUrl || '',
        project.featured ? 'TRUE' : 'FALSE',
        new Date().toISOString(),
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_PROJECTS}!A:I`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return true;
  } catch (error) {
    console.error('Error adding project:', error);
    return false;
  }
}
