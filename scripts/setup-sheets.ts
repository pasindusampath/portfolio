import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SHEET_TITLES = {
  PROJECTS: 'Projects',
  PROFILE: 'Profile',
  SKILLS: 'Skills',
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

    // 3. Write Headers (and initial data for Profile if empty)
    console.log('📝 Writing headers...');

    // Projects Header
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${SHEET_TITLES.PROJECTS}!A1:I1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [HEADERS[SHEET_TITLES.PROJECTS]] }
    });

    // Profile Header
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${SHEET_TITLES.PROFILE}!A1:B1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [HEADERS[SHEET_TITLES.PROFILE]] }
    });

    // Skills Header
    await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${SHEET_TITLES.SKILLS}!A1:B1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [HEADERS[SHEET_TITLES.SKILLS]] }
    });

    console.log('✅ Headers updated.');

    // 4. Populate Profile with default data if it looks empty (check row 2)
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

    console.log('🎉 Spreadsheet setup complete!');

  } catch (error: any) {
    console.error('❌ Error setting up sheets:', error.message);
    if (error.code === 403) {
        console.error('👉 Tip: Make sure you shared the spreadsheet with the Service Account Email:', email);
    }
  }
}

setupSheets();
