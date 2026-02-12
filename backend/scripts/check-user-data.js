'use strict';

require('dotenv').config();
const { pool } = require('../db');

async function check() {
  try {
    const users = await pool.query('SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT 5');
    console.log('\n📊 Benutzer:');
    console.log(users.rows.length ? users.rows.map(u => `  - ${u.email} (${u.id})`).join('\n') : '  (keine)');
    
    if (users.rows.length > 0) {
      const data = await pool.query(`
        SELECT user_id, 
               jsonb_object_keys(app_state) as keys,
               updated_at,
               jsonb_array_length(daily_history) as history_count
        FROM user_data
        ORDER BY updated_at DESC
      `);
      console.log('\n💾 Gespeicherte Daten:');
      for (const row of data.rows) {
        const user = users.rows.find(u => u.id === row.user_id);
        console.log(`  - ${user?.email || row.user_id}: ${row.keys || '(leer)'}, ${row.history_count || 0} Tage History`);
      }
      
      // Zeige Details für ersten User
      if (users.rows.length > 0) {
        const firstUserId = users.rows[0].id;
        const detail = await pool.query('SELECT app_state, daily_history FROM user_data WHERE user_id = $1', [firstUserId]);
        if (detail.rows.length > 0) {
          console.log('\n📋 Details (erster User):');
          const state = detail.rows[0].app_state || {};
          console.log(`  Name: ${state.userData?.name || '(nicht gesetzt)'}`);
          console.log(`  Alter: ${state.userData?.age || '-'}`);
          console.log(`  Ziele: ${state.userData?.goals?.length || 0}`);
          console.log(`  Wasser heute: ${state.waterIntake || 0}ml`);
          console.log(`  History Einträge: ${(detail.rows[0].daily_history || []).length}`);
        }
      }
    }
  } catch (err) {
    console.error('Fehler:', err.message);
  } finally {
    await pool.end();
  }
}

check();
