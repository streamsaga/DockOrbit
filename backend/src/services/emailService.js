// emailService.js
//
// Sends one-time verification codes over SMTP using nodemailer. Works
// with any SMTP provider - Gmail, Outlook, SendGrid, Mailgun, etc. -
// configured entirely through .env, no code changes needed to switch
// providers.
//
// For Gmail specifically: you cannot use your normal Gmail password.
// You must generate an "App Password" at
// https://myaccount.google.com/apppasswords (requires 2-Step
// Verification to be turned on for your Google account first).

import nodemailer from "nodemailer";

let transporter = null;

// Built lazily (on first send) rather than at module load time, so
// env vars are guaranteed to be loaded first - same class of timing
// bug as the YouTube/JWT keys earlier in this project.
function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for 587/25
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

function generateOtpCode() {
  // 6-digit numeric code, zero-padded
  return String(Math.floor(100000 + Math.random() * 900000));
}

const EMAIL_ACCENT = "#2b2b2b"; // matches the site's near-black grayscale accent, not a colored brand hue
const EMAIL_INK = "#1a1a1a";
const EMAIL_MUTED = "#6e6e6e";
const EMAIL_BG = "#e8e8e8"; // exact match to the site's neumorphic base surface color

function emailShell(bodyHtml) {
  return `
  <div style="background:${EMAIL_BG}; padding: 32px 16px; font-family: 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden;">
      <tr>
        <td style="background: ${EMAIL_ACCENT}; padding: 22px 32px;">
          <span style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">DockOrbit</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 32px;">
          ${bodyHtml}
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 32px; border-top: 1px solid #eef0f6;">
          <p style="margin:0; color: ${EMAIL_MUTED}; font-size: 12px; line-height: 1.6;">
            You're receiving this because someone (hopefully you) used this email on DockOrbit.
            If this wasn't you, you can safely ignore this message.
          </p>
        </td>
      </tr>
    </table>
  </div>`;
}

function codeBlock(code) {
  return `<div style="background: #f0f0f0; border-radius: 14px; padding: 20px; text-align: center; margin: 22px 0;">
    <span style="font-family: 'SFMono-Regular', Consolas, monospace; font-size: 34px; font-weight: 700; letter-spacing: 10px; color: ${EMAIL_ACCENT};">${code}</span>
  </div>`;
}

async function sendEmail(to, subject, html) {
  console.log(`[email] Sending "${subject}" to ${to}...`);
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log(`[email] Dev mode fallback: SMTP not configured. Content:\n${html}`);
    return { messageId: "dev-mock-id" };
  }
  try {
    const t = getTransporter();
    const info = await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log(`[email] Sent successfully. Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[email] Failed to send email via SMTP: ${err.message}. Email body contained:\n${html}`);
    return { messageId: "failed-fallback" };
  }
}

/**
 * Call once at server startup (see server.js) to confirm the SMTP
 * credentials actually work, BEFORE a real user hits signup and
 * silently gets no email. Logs a clear pass/fail message either way.
 */
export async function verifyEmailConfig() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(
      "[email] SMTP_HOST/SMTP_USER/SMTP_PASS are not fully set in .env - " +
        "signup verification and password reset emails will fail until these are configured."
    );
    return;
  }

  try {
    await getTransporter().verify();
    console.log("[email] SMTP connection verified - ready to send emails.");
  } catch (err) {
    console.error(
      "[email] SMTP verification FAILED. Emails will not send until this is fixed:",
      err.message
    );
  }
}

export async function sendSignupOtp(to, code, name) {
  const body = `
    <h1 style="margin: 0 0 12px; font-size: 22px; color: ${EMAIL_INK}; font-weight: 700;">
      Welcome${name ? `, ${name}` : ""} 👋
    </h1>
    <p style="margin: 0 0 4px; font-size: 15px; color: ${EMAIL_INK}; line-height: 1.6;">
      Use this code to verify your email and finish creating your account:
    </p>
    ${codeBlock(code)}
    <p style="margin: 0; color: ${EMAIL_MUTED}; font-size: 13px;">
      This code expires in 10 minutes.
    </p>`;
  await sendEmail(to, "Verify your email - DockOrbit", emailShell(body));
}

export async function sendPasswordResetOtp(to, code) {
  const body = `
    <h1 style="margin: 0 0 12px; font-size: 22px; color: ${EMAIL_INK}; font-weight: 700;">
      Reset your password
    </h1>
    <p style="margin: 0 0 4px; font-size: 15px; color: ${EMAIL_INK}; line-height: 1.6;">
      Use this code to reset your password:
    </p>
    ${codeBlock(code)}
    <p style="margin: 0; color: ${EMAIL_MUTED}; font-size: 13px;">
      This code expires in 10 minutes. If you didn't request this, your password will not be changed.
    </p>`;
  await sendEmail(to, "Reset your password - DockOrbit", emailShell(body));
}

export async function sendWelcomeEmail(to, name) {
  const body = `
    <h1 style="margin: 0 0 12px; font-size: 22px; color: ${EMAIL_INK}; font-weight: 700;">
      You're all set${name ? `, ${name}` : ""} 🎉
    </h1>
    <p style="margin: 0; font-size: 15px; color: ${EMAIL_INK}; line-height: 1.6;">
      Your email is verified and your DockOrbit account is ready. Head back to the app to
      start discovering trustworthy channels and the best learning playlists.
    </p>`;
  await sendEmail(to, "Welcome to DockOrbit", emailShell(body));
}

export { generateOtpCode };