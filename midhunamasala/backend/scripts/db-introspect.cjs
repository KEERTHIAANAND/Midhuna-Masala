/*
  One-off helper: introspect orders constraints + create_order() function.
  Reads backend/.env (DATABASE_URL).
*/

const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config({ path: path.join(process.cwd(), '.env'), override: true });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in backend/.env');
  process.exit(1);
}

const shouldUseSsl =
  String(process.env.DATABASE_SSL || '').toLowerCase() === 'true' ||
  DATABASE_URL.includes('supabase.co') ||
  DATABASE_URL.includes('sslmode=require');

async function main() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
  });

  await client.connect();
  try {
    const cons = await client.query(
      "select conname, pg_get_constraintdef(oid) as def from pg_constraint where conrelid='public.orders'::regclass and contype='c' order by conname"
    );
    console.log('CHECK CONSTRAINTS on public.orders:');
    for (const r of cons.rows) console.log('-', r.conname + ':', r.def);

    const fns = await client.query(
      "select p.oid, pg_get_function_identity_arguments(p.oid) as args from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='create_order' order by p.oid"
    );
    console.log('\ncreate_order overloads:', fns.rows);

    if (fns.rows[0]) {
      const def = await client.query('select pg_get_functiondef($1::oid) as def', [fns.rows[0].oid]);
      console.log('\ncreate_order definition:\n' + def.rows[0].def);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
