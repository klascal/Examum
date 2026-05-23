const { db } = require('../config/database');

function requireAuth(role) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    // Admin heeft altijd toegang, ook tot docent-routes
    if (role && req.session.user.role !== role && req.session.user.role !== 'admin') {
      return res.status(403).render('error', { message: 'Geen toegang', title: 'Verboden' });
    }
    next();
  };
}

function requireKandidaat(req, res, next) {
  if (!req.session.kandidaatExamen) {
    return res.redirect('/kandidaat-login');
  }
  next();
}

function requireActiveExamen(req, res, next) {
  // BELANGRIJK: Altijd DB checken, niet alleen session!
  const keId = req.session.kandidaatExamen?.id;
  if (!keId) {
    return res.redirect('/kandidaat-login');
  }

  const ke = db.prepare('SELECT * FROM kandidaat_examen WHERE id = ?').get(keId);
  if (!ke || ke.status !== 'bezig') {
    if (ke) {
      req.session.kandidaatExamen = { ...req.session.kandidaatExamen, ...ke };
    }
    return res.redirect('/examen');
  }

  req.session.kandidaatExamen = { ...req.session.kandidaatExamen, ...ke };
  next();
}

module.exports = { requireAuth, requireKandidaat, requireActiveExamen };
