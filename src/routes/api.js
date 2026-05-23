const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { requireActiveExamen } = require('../middleware/auth');

// Fraud event loggen
router.post('/fraud/log', requireActiveExamen, (req, res) => {
  const { event_type, event_data } = req.body;
  const ke = req.session.kandidaatExamen;

  // Valideer event_type
  const toegestaneTypes = ['tab_switch', 'visibility_change', 'copy_paste', 'right_click', 'fullscreen_exit', 'exam_start'];
  if (!event_type || !toegestaneTypes.includes(event_type)) {
    return res.status(400).json({ error: 'Ongeldig event type' });
  }

  db.prepare(`
    INSERT INTO fraud_logs (id, kandidaat_examen_id, event_type, event_data)
    VALUES (?, ?, ?, ?)
  `).run(uuidv4(), ke.id, event_type, JSON.stringify(event_data || {}));

  db.prepare(`
    UPDATE kandidaat_examen SET fraud_count = fraud_count + 1 WHERE id = ?
  `).run(ke.id);

  res.json({ success: true });
});

// Timer check (AJAX) – gebruik DB tijd voor consistentie
router.get('/timer/status', requireActiveExamen, (req, res) => {
  const ke = req.session.kandidaatExamen;

  // Haal gestart op uit DB als UTC string
  const row = db.prepare("SELECT gestart, tijdlimiet, examen_id FROM kandidaat_examen WHERE id = ?").get(ke.id);
  if (!row || !row.gestart) {
    return res.json({ overSec: 0, finished: true });
  }

  const examen = db.prepare("SELECT tijdlimiet FROM examens WHERE id = ?").get(row.examen_id);
  const tijdlimietMin = row.tijdlimiet || (examen && examen.tijdlimiet) || 45;

  // SQLite datetime() geeft UTC, converteer correct
  const gestartDate = new Date(row.gestart.replace(' ', 'T') + 'Z');
  const tijdlimietMs = tijdlimietMin * 60 * 1000;
  const verstrekenMs = Date.now() - gestartDate.getTime();
  const overMs = Math.max(0, tijdlimietMs - verstrekenMs);
  const overSec = Math.floor(overMs / 1000);

  res.json({ overSec, finished: overSec <= 0 });
});

module.exports = router;
