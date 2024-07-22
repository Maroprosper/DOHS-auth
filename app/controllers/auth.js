const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/auth.config.js');
const owasp = require('owasp-password-strength-test');
const { sendVerificationEmail } = require('../utils/email');
const { generateSecret, generateQRCode, verifyToken: verify2FAToken } = require('../utils/2fa');

exports.signup = async (req, res) => {
  try {
    const passwordValidation = owasp.test(req.body.password);
    if (!passwordValidation.strong) {
      return res.status(400).send({ message: 'Password does not meet strength requirements' });
    }

    const newUser = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      designation: req.body.designation,
      registration_number: req.body.registration_number,
      state_or_region: req.body.state_or_region,
      emailVerified: false,
      twoFactorSecret: generateSecret().base32,
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: 86400 });
    await sendVerificationEmail(newUser, token);

    res.status(201).send({ message: 'User registered successfully! Please verify your email.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
};

const handleSignin = async (user, req, res, errorMessage) => {
  if (!user) return res.status(401).send({ accessToken: null, error: errorMessage });

  const validPassword = bcrypt.compareSync(req.body.password, user.password);
  if (!validPassword) return res.status(401).send({ accessToken: null, error: errorMessage });

  const token = generateToken(user);
  res.status(200).send({ id: user.id, email: user.email, accessToken: token });
};

exports.signinnonmed = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    await handleSignin(user, req, res, 'Invalid email or password');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signinmed = async (req, res) => {
  try {
    const user = await User.findOne({ where: { registration_number: req.body.registration_number } });
    await handleSignin(user, req, res, 'Invalid registration number or password');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, config.secret);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).send({ message: 'User not found' });

    user.emailVerified = true;
    await user.save();

    res.status(200).send({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.setup2FA = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).send({ message: 'User not found' });

    const secret = generateSecret();
    user.twoFactorSecret = secret.base32;
    await user.save();

    const qrCode = await generateQRCode(secret.otpauth_url);
    res.status(200).send({ qrCode });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.verify2FA = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).send({ message: 'User not found' });

    const isValid = verify2FAToken(user.twoFactorSecret, req.body.token);
    if (!isValid) return res.status(401).send({ message: 'Invalid 2FA token' });

    res.status(200).send({ message: '2FA verification successful' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
