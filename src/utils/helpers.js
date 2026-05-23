const { v4: uuidv4 } = require('uuid');

function generateCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Format: XXXX-XXXX
  return result.slice(0, 4) + '-' + result.slice(4);
}

function generateId() {
  return uuidv4();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

module.exports = { generateCode, generateId, formatTime };
