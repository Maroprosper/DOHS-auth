const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (user, token) => {
  const url = `http://localhost:3000/verify-email?token=${token}`;
  await transporter.sendMail({
    to: user.email,
    subject: 'Verify Email',
    html: `Click <a href="${url}">here</a> to verify your email.`
  });
};

module.exports = { sendVerificationEmail };
