import nodemailer from 'nodemailer';
import config from '../config/index.js';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  auth: { user: config.smtp.user, pass: config.smtp.pass },
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!config.smtp.user) {
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
    return;
  }
  await transporter.sendMail({ from: config.smtp.from, to, subject, html });
};

export const sendOTPEmail = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: 'KavyaKosh - Your OTP Code',
    html: `<div style="font-family:sans-serif;padding:20px;background:#1a1a2e;color:#fff;border-radius:12px;">
      <h2 style="color:#e94560;">KavyaKosh</h2>
      <p>Your verification code is:</p>
      <h1 style="letter-spacing:8px;color:#e94560;">${otp}</h1>
      <p>Valid for 10 minutes.</p>
    </div>`,
  });
};

export const sendResetEmail = async (email, token) => {
  const url = `${config.clientUrl}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: 'KavyaKosh - Reset Password',
    html: `<div style="font-family:sans-serif;padding:20px;">
      <h2>Reset Your Password</h2>
      <a href="${url}" style="background:#e94560;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">Reset Password</a>
      <p>Link expires in 1 hour.</p>
    </div>`,
  });
};
