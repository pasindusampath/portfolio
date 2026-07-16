import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SHEET_TITLES = {
  PROJECTS: 'Projects',
  PROFILE: 'Profile',
  SKILLS: 'Skills',
  USERS: 'Users',
  TOKENS: 'Tokens',
  REVOKED_TOKENS: 'RevokedTokens',
  DAILY_NOTES: 'DailyNotes',
};

const HEADERS = {
  [SHEET_TITLES.PROJECTS]: [
    'id', 'title', 'description', 'imageUrl', 'technologies', 'demoUrl', 'repoUrl', 'featured', 'createdAt'
  ],
  [SHEET_TITLES.PROFILE]: [
    'key', 'value'
  ],
  [SHEET_TITLES.SKILLS]: [
    'category', 'items' // comma separated items
  ],
  [SHEET_TITLES.USERS]: [
    'id', 'email', 'password_hash', 'role', 'created_at'
  ],
  [SHEET_TITLES.TOKENS]: [
    'token_id', 'user_id', 'device_id', 'refresh_token_hash', 'expires_at', 'created_at'
  ],
  [SHEET_TITLES.REVOKED_TOKENS]: [
    'token_id', 'user_id', 'device_id', 'revoked_at', 'reason'
  ],
  [SHEET_TITLES.DAILY_NOTES]: [
    'date', 'content'
  ]
};

const INITIAL_PROFILE_DATA = [
  ['name', 'Pasindu Sampath'],
  ['role', 'Software Engineer'],
  ['bio', 'Hi, I’m Pasindu Sampath. I’m a passionate software developer with experience in web and application development. I love creating projects that solve real-world problems and continuously learning new technologies to improve my skills.'],
  ['email', 'hello@pasindusampath.com'],
  ['avatarUrl', ''],
  ['github', 'https://github.com/pasindusampath'],
  ['linkedin', 'https://www.linkedin.com/in/pasindu-tb/'],
  ['facebook', 'https://web.facebook.com/PASINDU.T.B']
];

async function setupSheets() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    console.error('❌ Missing credentials in .env.local. Please check GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID.');
    process.exit(1);
  }

  console.log('🔌 Connecting to Google Sheets...');
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: key.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // 1. Get current sheets to check what exists
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    const currentSheets = spreadsheet.data.sheets || [];
    const currentTitles = currentSheets.map(s => s.properties?.title);

    console.log(`📄 Found existing sheets: ${currentTitles.join(', ')}`);

    const requests: any[] = [];

    // 2. Prepare requests to add missing sheets
    Object.values(SHEET_TITLES).forEach(title => {
      if (!currentTitles.includes(title)) {
        console.log(`➕ Preparing to add sheet: ${title}`);
        requests.push({
          addSheet: {
            properties: { title }
          }
        });
      }
    });

    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: { requests }
      });
      console.log('✅ Created missing sheets.');
    } else {
        console.log('✅ All sheets already exist.');
    }

    // 3. Write Headers
    console.log('📝 Writing headers...');

    for (const [title, headers] of Object.entries(HEADERS)) {
         await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${title}!A1:${String.fromCharCode(65 + headers.length - 1)}1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [headers] }
        });
    }

    console.log('✅ Headers updated.');

    // 4. Populate Profile with default data if it looks empty
    const profileData = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${SHEET_TITLES.PROFILE}!A2:A2`
    });
    
    if (!profileData.data.values || profileData.data.values.length === 0) {
        console.log('👤 Populating initial profile data...');
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${SHEET_TITLES.PROFILE}!A2:B${INITIAL_PROFILE_DATA.length + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: INITIAL_PROFILE_DATA }
        });
        console.log('✅ Profile initialized.');
    }

    // 5. Seed Admin User if Users is empty
    const usersData = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${SHEET_TITLES.USERS}!A2:A2`
    });

    if (!usersData.data.values || usersData.data.values.length === 0) {
        console.log('🔒 Seeding initial Admin user...');
        const initialPassword = '1234'; 
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(initialPassword, salt);
        const adminUser = [
            uuidv4(),
            'admin@example.com',
            hash,
            'admin',
            new Date().toISOString()
        ];

        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${SHEET_TITLES.USERS}!A2:E2`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [adminUser] }
        });
        console.log(`✅ Admin created! Email: admin@example.com, Password: ${initialPassword}`);
    }

    console.log('🎉 Spreadsheet setup complete!');

  } catch (error: any) {
    console.error('❌ Error setting up sheets:', error.message);
    if (error.code === 403) {
        console.error('👉 Tip: Make sure you shared the spreadsheet with the Service Account Email:', email);
    }
  }
}

setupSheets();
