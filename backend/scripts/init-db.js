'use strict';

require('dotenv').config();
const { pool } = require('../db');
const fs = require('fs');
const path = require('path');

async function init() {
  const sql = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Schema angelegt.');
  await pool.end();
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
