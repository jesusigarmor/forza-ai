import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

config({ path: '.env.local' });

const [email, newPassword] = process.argv.slice(2);

if (!email || !newPassword) {
  console.error('Usage: node scripts/reset-password.mjs <email> <newPassword>');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const hash = await bcrypt.hash(newPassword, 10);

const rows = await sql`
  UPDATE app_users
  SET password_hash = ${hash}
  WHERE email = ${email}
  RETURNING id, name, email
`;

if (rows.length === 0) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

console.log(`✓ Password reset for ${rows[0].name} (${rows[0].email})`);
