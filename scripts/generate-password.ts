/**
 * Password Hash Generator
 * -----------------------
 * Generates a bcrypt hash for a given password so you can paste it directly
 * into the Google Sheet's `Users` tab (column C: passwordHash).
 *
 * Usage:
 *   npx tsx scripts/generate-password.ts <your-password>
 *
 * Example:
 *   npx tsx scripts/generate-password.ts mySecretPass123
 */

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function main() {
    const password = process.argv[2];

    if (!password) {
        console.error('\n❌  Usage: npx tsx scripts/generate-password.ts <your-password>\n');
        process.exit(1);
    }

    console.log('\n⏳  Hashing password (bcrypt, 10 rounds)...\n');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const id = uuidv4();

    console.log('─────────────────────────────────────────────────────');
    console.log('  Copy the values below into your Google Sheet:');
    console.log('─────────────────────────────────────────────────────');
    console.log(`  ID            →  ${id}`);
    console.log(`  Password Hash →  ${hash}`);
    console.log('─────────────────────────────────────────────────────');
    console.log('\n  Sheet row format (paste into Users tab):');
    console.log(`  | ${id} | your@email.com | ${hash} | admin |\n`);
}

main();
