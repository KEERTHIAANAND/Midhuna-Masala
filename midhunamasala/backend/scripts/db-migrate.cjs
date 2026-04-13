/*
  Simple SQL migration runner for Supabase Postgres.

  - Applies backend/src/db/00x_*.sql files in numeric order.
  - Tracks applied migrations in schema_migrations.

  Usage:
    cd midhunamasala/backend
    # set DATABASE_URL in .env
    npm run db:migrate
*/

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('pg');

// IMPORTANT: On Windows it's common to have DATABASE_URL set globally.
// We want the local backend/.env to be authoritative for this script.
dotenv.config({ path: path.join(process.cwd(), '.env'), override: true });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in backend/.env');
  console.error('Tip: copy backend/.env.example → backend/.env and fill DATABASE_URL');
  process.exit(1);
}

const shouldUseSsl =
  String(process.env.DATABASE_SSL || '').toLowerCase() === 'true' ||
  DATABASE_URL.includes('supabase.co') ||
  DATABASE_URL.includes('sslmode=require');

function getSanitizedConnectionDebugInfo(connectionString) {
  try {
    const u = new URL(connectionString);
    const password = u.password || '';
    return {
      host: u.hostname,
      port: u.port || '(default)',
      user: u.username,
      database: u.pathname.replace(/^\//, ''),
      ssl: shouldUseSsl,
      passwordLength: password.length,
      passwordHasWhitespace: /\s/.test(password),
      passwordHasNonAlnum: /[^a-zA-Z0-9]/.test(password),
    };
  } catch {
    return { error: 'Invalid DATABASE_URL (cannot parse as URL)' };
  }
}

const migrationsDir = path.join(process.cwd(), 'src', 'db');

function parseMigrationNumber(filename) {
  const match = filename.match(/^(\d+)_/);
  return match ? Number(match[1]) : Number.NaN;
}

function listMigrationFiles() {
  const all = fs.readdirSync(migrationsDir);
  const sqlFiles = all.filter((f) => /^\d+_.+\.sql$/i.test(f));
  return sqlFiles.sort((a, b) => parseMigrationNumber(a) - parseMigrationNumber(b));
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getAppliedMigrations(client) {
  const res = await client.query('SELECT filename FROM schema_migrations ORDER BY filename');
  return new Set(res.rows.map((r) => r.filename));
}

async function applyMigrationFile(client, filename) {
  const fullPath = path.join(migrationsDir, filename);
  const sql = fs.readFileSync(fullPath, 'utf8');

  process.stdout.write(`→ Applying ${filename} ... `);

  await client.query('BEGIN');
  try {
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations(filename) VALUES ($1)', [filename]);
    await client.query('COMMIT');
    process.stdout.write('OK\n');
  } catch (err) {
    await client.query('ROLLBACK');
    process.stdout.write('FAILED\n');
    throw err;
  }
}

async function main() {
  if (String(process.env.MIGRATE_DEBUG || '').toLowerCase() === 'true') {
    console.log('[db-migrate] Connection debug (sanitized):');
    console.log(getSanitizedConnectionDebugInfo(DATABASE_URL));
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
  });

  await client.connect();
  try {
    await ensureMigrationsTable(client);

    const files = listMigrationFiles();
    if (files.length === 0) {
      console.log('No migration files found in src/db');
      return;
    }

    const applied = await getAppliedMigrations(client);

    const pending = files.filter((f) => !applied.has(f));
    if (pending.length === 0) {
      console.log('Database is up to date (no pending migrations).');
      return;
    }

    console.log(`Found ${files.length} migrations; ${pending.length} pending.`);

    for (const filename of pending) {
      await applyMigrationFile(client, filename);
    }

    console.log('✅ Migrations applied successfully.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('\nMigration failed.');
  if (
    err &&
    err.code === 'ENOTFOUND' &&
    typeof err.hostname === 'string' &&
    err.hostname.includes('.supabase.co') &&
    err.hostname.startsWith('db.')
  ) {
    console.error('\nIt looks like you are using Supabase Direct Connection (db.<project-ref>.supabase.co).');
    console.error('That host is often IPv6-only. On IPv4-only networks/machines this can fail to resolve.');
    console.error('\nFix: In Supabase → Connect → Direct, switch Connection Method to Transaction pooler or Session pooler');
    console.error('and copy the new URI (it usually uses a host like *.pooler.supabase.com).');
    console.error('Then paste that into DATABASE_URL and re-run: npm run db:migrate\n');
  }

  const timedOut =
    (err && err.code === 'ETIMEDOUT') ||
    (err && err.name === 'AggregateError' && err.code === 'ETIMEDOUT');

  if (timedOut) {
    console.error('\nYour network could not reach the database host/port (connection timed out).');
    console.error('This commonly happens when the pooler port (often 6543) is blocked by firewall/ISP.');
    console.error('\nFix options:');
    console.error('1) In Supabase → Connect → Direct, switch Connection Method to "Session pooler" and copy the URI (often uses port 5432).');
    console.error('2) Try a different network (mobile hotspot) or allow outbound TCP to the shown port.');
    console.error('3) As a fallback, run the SQL migrations inside Supabase SQL Editor.\n');
  }

  if (err && err.code === '28P01') {
    console.error('\nPostgres rejected the password for user "postgres" (auth failed).');
    console.error('Fix:');
    console.error('1) In Supabase → Database → Settings, click "Reset password" and set a new DB password.');
    console.error('2) In Supabase → Connect → Direct, copy a fresh connection URI and paste it into DATABASE_URL.');
    console.error('   (Supabase cannot display your password again — you must type it into the Connect screen before copying the URI.)');
    console.error('3) If your password contains special characters like @ : / ? # [ ] or spaces, URL-encode it.');
    console.error('   Example: p@ss:word -> p%40ss%3Aword');
    console.error('4) If you previously set DATABASE_URL in your system environment, open a new terminal after updating backend/.env.');
    console.error('Then re-run: npm run db:migrate\n');
  }
  console.error(err);
  process.exit(1);
});
