const crypto = require('crypto');
const { dbAsync } = require('../database/db');

function generateSecureRandomString(length = 4) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += charset[randomBytes[i] % charset.length];
  }
  return result;
}

async function generateLicenseKey(productCode, planCode) {
  const pCode = (productCode || 'APP').toUpperCase();
  const plCode = (planCode || 'STD').toUpperCase();

  for (let i = 0; i < 5; i++) {
    const r1 = generateSecureRandomString(4);
    const r2 = generateSecureRandomString(4);
    const r3 = generateSecureRandomString(4);
    const key = `PL-${pCode}-${plCode}-${r1}-${r2}-${r3}`;

    const existing = await dbAsync.get('SELECT id FROM licenses WHERE license_key = ?', [key]);
    if (!existing) {
      return key;
    }
  }
  return `PL-${pCode}-${plCode}-${generateSecureRandomString(4)}-${generateSecureRandomString(4)}-${generateSecureRandomString(4)}`;
}

module.exports = { generateLicenseKey, generateSecureRandomString };
