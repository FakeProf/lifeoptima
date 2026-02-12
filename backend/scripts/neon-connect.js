'use strict';

require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL fehlt in .env');
  process.exit(1);
}

const client = new Client({ connectionString, ssl: { rejectUnauthorized: true } });

async function run() {
  try {
    await client.connect();
    const r = await client.query('SELECT 1 as ok, current_database() as db');
    console.log('Verbindung OK:', r.rows[0]);
    const tables = await client.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    console.log('Tabellen (public):', tables.rows.length ? tables.rows.map((t) => t.tablename).join(', ') : '(keine)');
  } catch (err) {
    console.error('Fehler:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
