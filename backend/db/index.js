'use strict';

require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// Unpooled URL für Neon Serverless (Netlify Functions) – gepoolte URL verursacht Probleme
const connectionString = process.env.NETLIFY_DATABASE_URL_UNPOOLED
    || process.env.DATABASE_URL
    || process.env.NETLIFY_DATABASE_URL;
const sql = connectionString ? neon(connectionString) : null;

/**
 * pg-kompatibler Adapter: query(text, params) → { rows }
 * Für Neon serverless in Netlify Functions (kein TCP, HTTPS-basiert).
 */
async function query(text, params = []) {
    if (!sql) throw new Error('DATABASE_URL fehlt');
    const rows = await sql.query(text, params);
    return { rows: Array.isArray(rows) ? rows : (rows ? [rows] : []) };
}

/** Legacy: pool.query wird überall verwendet – wir exportieren ein pool-ähnliches Objekt. */
const pool = {
    query
};

module.exports = { pool, query, sql };
