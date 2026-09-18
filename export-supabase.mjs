// Run this once, locally, while your Supabase project is resumed.
//
// Setup:
//   npm install @supabase/supabase-js dotenv
//   node export-supabase-data.mjs
//
// Reads VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY from .env.local
// (same values your app already uses) and writes one JSON file per
// table into ./exports/

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync } from 'fs';

config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY (or legacy VITE_SUPABASE_ANON_KEY) in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tables = ['characters', 'aus', 'posts', 'character_aus'];

async function exportTable(table) {
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    console.error(`Failed to export ${table}:`, error.message);
    return null;
  }
  console.log(`${table}: ${data.length} rows`);
  return data;
}

async function main() {
  mkdirSync('./exports', { recursive: true });

  for (const table of tables) {
    const data = await exportTable(table);
    if (data) {
      writeFileSync(`./exports/${table}.json`, JSON.stringify(data, null, 2));
    }
  }

  console.log('\nDone. Check the ./exports folder.');
}

main();
