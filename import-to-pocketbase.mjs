// Run this after export-supabase-data.mjs has produced ./exports/*.json
// and after you've created the characters / aus / posts collections in
// PocketBase (see the schema list from Claude alongside this script).
//
// Setup:
//   npm install pocketbase dotenv
//   node import-to-pocketbase.mjs
//
// Add these to .env.local:
//   POCKETBASE_URL=http://127.0.0.1:8090
//   POCKETBASE_ADMIN_EMAIL=your-superuser-email
//   POCKETBASE_ADMIN_PASSWORD=your-superuser-password

import PocketBase from 'pocketbase';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

config({ path: '.env.local' });

const {
  POCKETBASE_URL,
  POCKETBASE_ADMIN_EMAIL,
  POCKETBASE_ADMIN_PASSWORD,
} = process.env;

if (!POCKETBASE_URL || !POCKETBASE_ADMIN_EMAIL || !POCKETBASE_ADMIN_PASSWORD) {
  console.error('Missing POCKETBASE_URL / POCKETBASE_ADMIN_EMAIL / POCKETBASE_ADMIN_PASSWORD in .env.local');
  process.exit(1);
}

const pb = new PocketBase(POCKETBASE_URL);

function loadJSON(name) {
  return JSON.parse(readFileSync(`./exports/${name}.json`, 'utf8'));
}

// Your PocketBase `posts.type` options are text / image / art — the old
// Supabase data also has "screenshot", which isn't a valid option anymore.
function mapPostType(oldType) {
  if (oldType === 'screenshot') return 'image';
  return oldType;
}

async function main() {
  await pb.collection('_superusers').authWithPassword(
    POCKETBASE_ADMIN_EMAIL,
    POCKETBASE_ADMIN_PASSWORD
  );
  console.log('Authenticated as superuser.\n');

  const ausData = loadJSON('aus');
  const charactersData = loadJSON('characters');
  const postsData = loadJSON('posts');
  const characterAusData = loadJSON('character_aus');

  // --- Step 1: AUs (no dependencies) ---
  const auIdMap = {}; // old Supabase UUID -> new PocketBase id
  for (const au of ausData) {
    const record = await pb.collection('aus').create({
      title: au.title,
      slug: au.slug,
      description: au.description || '',
      cover_image: au.cover_image || '',
    });
    auIdMap[au.id] = record.id;
    console.log(`AU: ${au.title} -> ${record.id}`);
  }

  // --- Step 2: Characters, folding character_aus into a relation array ---
  const characterIdMap = {}; // old Supabase UUID -> new PocketBase id
  for (const char of charactersData) {
    const linkedAuOldIds = characterAusData
      .filter((link) => link.character_id === char.id)
      .map((link) => link.au_id);
    const linkedAuNewIds = linkedAuOldIds
      .map((oldId) => auIdMap[oldId])
      .filter(Boolean);

    const record = await pb.collection('characters').create({
      name: char.name,
      slug: char.slug,
      avatar: char.avatar || '',
      generation: char.generation ?? null,
      status: char.status || '',
      family_name: char.family_name || '',
      branding: char.branding || '',
      fate_number: char.fate_number || '',
      age: char.age || '',
      birthplace: char.birthplace || '',
      current_residence: char.current_residence || '',
      hair_color: char.hair_color || '',
      highlight: char.highlight || '',
      eye_color: char.eye_color || '',
      height: char.height || '',
      tags: char.tags || [],
      skills: char.skills || [],
      tools: char.tools || [],
      short_bio: char.short_bio || '',
      aus: linkedAuNewIds,
    });
    characterIdMap[char.id] = record.id;
    console.log(`Character: ${char.name} -> ${record.id} (${linkedAuNewIds.length} AU link[s])`);
  }

  // --- Step 3: Posts, remapping au_id -> au relation ---
  for (const post of postsData) {
    const newAuId = auIdMap[post.au_id];
    if (!newAuId) {
      console.warn(`Skipping post "${post.title || post.id}" — its AU wasn't found in the AU map.`);
      continue;
    }

    const record = await pb.collection('posts').create({
      au: [newAuId],
      type: mapPostType(post.type),
      date: post.date || '',
      title: post.title || '',
      content: post.content || '',
      source_link: post.source_link || '',
    });
    console.log(`Post: ${post.title || '(untitled)'} -> ${record.id}`);
  }

  console.log('\nMigration complete.');
  console.log(`AUs: ${ausData.length}, Characters: ${charactersData.length}, Posts: ${postsData.length}`);
}

main().catch((err) => {
  console.error('\nMigration failed:', err);
  process.exit(1);
});
