const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const generateSecret = () => {
  return speakeasy.generateSecret({ length: 20 });
};

const generateQRCode = async (secret) => {
  return await qrcode.toDataURL(secret.otpauth_url);
};

const verifyToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token
  });
};

module.exports = { generateSecret, generateQRCode, verifyToken };
