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

// --- Auth Operations ---

import { User, AuthToken } from '@/types';

const SHEET_USERS = 'Users';
const SHEET_TOKENS = 'Tokens';
const SHEET_REVOKED = 'RevokedTokens';

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_USERS}!A2:E`,
    });
    const rows = response.data.values || [];
    const userRow = rows.find(r => r[1] === email);
    
    if (!userRow) return null;

    return {
      id: userRow[0],
      email: userRow[1],
      passwordHash: userRow[2],
      role: userRow[3]
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function storeRefreshToken(token: AuthToken, tokenHash: string) {
  try {
    const values = [[
      token.tokenId,
      token.userId,
      token.deviceId,
      tokenHash,
      token.expiresAt,
      new Date().toISOString()
    ]];
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_TOKENS}!A:F`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });
  } catch (error) {
    console.error('Error storing token:', error);
  }
}

export async function findRefreshToken(device_id: string): Promise<{ tokenId: string, hash: string, row: number } | null> {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_TOKENS}!A2:F`, 
        });
        const rows = response.data.values || [];
        // Find most recent token for this device? Or just ANY valid one?
        // Usually we look up by cookie's tokenId AND deviceId.
        // But here let's just return the found row if we scan by device_id (simpler for now, logic continues in route).
        // Actually best to look for specific tokenId if provided, but function sig requested find by ID.
        // Let's change sig to find by Token ID + Device combo later in logic.
        // For now, simple find by tokenId.
        return null; // Placeholder to avoid breaking current logic flow, will implement properly below
    } catch(e) { return null; }
}

export async function findTokenById(tokenId: string): Promise<{ tokenId: string, userId: string, deviceId: string, hash: string, row: number } | null> {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_TOKENS}!A2:F`,
        });
        const rows = response.data.values || [];
        const index = rows.findIndex(r => r[0] === tokenId);
        
        if (index === -1) return null;

        return {
            tokenId: rows[index][0],
            userId: rows[index][1],
            deviceId: rows[index][2],
            hash: rows[index][3],
            row: index + 2 // +2 because 1-based index and header row
        };
    } catch (error) {
        console.error('Error finding token:', error);
        return null;
    }
}

async function getSheetId(title: string): Promise<number | null> {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheet = meta.data.sheets?.find(s => s.properties?.title === title);
    return sheet?.properties?.sheetId || null;
}

export async function revokeToken(tokenId: string, reason: string = 'Refresh Rotation') {
    try {
        const token = await findTokenById(tokenId);
        if (!token) return;

        // 1. Add to Revoked
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_REVOKED}!A:E`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[token.tokenId, token.userId, token.deviceId, new Date().toISOString(), reason]]
            }
        });

        // 2. Delete from Tokens
        const sheetId = await getSheetId(SHEET_TOKENS);
        if (sheetId === null) return;

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId: sheetId,
                            dimension: 'ROWS',
                            startIndex: token.row - 1, // 0-based
                            endIndex: token.row
                        }
                    }
                }]
            }
        });
    } catch (error) {
        console.error('Error revoking token:', error);
    }
}
