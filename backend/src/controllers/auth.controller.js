const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const crypto    = require('crypto');
const nodemailer = require('nodemailer');
const prisma    = require('../db/client');

// ── helpers ──────────────────────────────────────────────────
const signToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const userSelect = { id:true, name:true, email:true, role:true, createdAt:true };

// Creates a nodemailer transporter from env vars.
// Works with Gmail, Outlook, Mailgun, SendGrid SMTP, Resend, etc.
function makeTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ── POST /api/auth/signup ─────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const normalizedRole = (role || 'MEMBER').toUpperCase();
    const assignedRole = ['ADMIN', 'MEMBER'].includes(normalizedRole) ? normalizedRole : 'MEMBER';

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: assignedRole },
      select: userSelect,
    });

    const token = signToken(user.id, user.role);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken(user.id, user.role);
    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────
const me = async (req, res) => {
  res.json({ user: req.user });
};

// ── PATCH /api/auth/me ────────────────────────────────────────
const updateMe = async (req, res) => {
  try {
    const { name, password } = req.body;
    const data = {};
    if (name)     data.name     = name;
    if (password) data.password = await bcrypt.hash(password, 12);
    const user = await prisma.user.update({ where: { id: req.user.id }, data, select: userSelect });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ── POST /api/auth/forgot-password ───────────────────────────
// Sends a reset link to the user's email.
// Always returns 200 (even if email not found) to prevent email enumeration.
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    // Always respond with success — don't leak whether email exists
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate a secure random token
    const rawToken   = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry     = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedToken, resetTokenExpiry: expiry },
    });

    // Build reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl    = `${frontendUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

    // If no SMTP configured, just log the link (great for local dev)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 PASSWORD RESET LINK (no SMTP configured):');
      console.log(resetUrl);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return res.json({ message: 'If that email exists, a reset link has been sent.', devLink: resetUrl });
    }

    // Send real email
    const transporter = makeTransporter();
    await transporter.sendMail({
      from:    `"TaskFlow" <${process.env.SMTP_USER}>`,
      to:      user.email,
      subject: 'Reset your TaskFlow password',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family:Inter,sans-serif;background:#0a0a0f;color:#f1f0ff;margin:0;padding:40px 20px">
          <div style="max-width:480px;margin:0 auto">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px">
              <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#2563eb);display:flex;align-items:center;justify-content:center;font-size:18px">⚡</div>
              <span style="font-size:20px;font-weight:700;color:#fff">TaskFlow</span>
            </div>
            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px">
              <h2 style="color:#fff;font-size:20px;margin:0 0 8px">Reset your password</h2>
              <p style="color:rgba(255,255,255,0.5);margin:0 0 24px;font-size:14px;line-height:1.6">
                Hi ${user.name}, we received a request to reset your TaskFlow password. Click the button below to choose a new one.
              </p>
              <a href="${resetUrl}"
                style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:14px">
                Reset Password →
              </a>
              <p style="color:rgba(255,255,255,0.3);margin:24px 0 0;font-size:12px">
                This link expires in <strong style="color:rgba(255,255,255,0.5)">1 hour</strong>. If you didn't request this, you can safely ignore this email.
              </p>
            </div>
            <p style="color:rgba(255,255,255,0.2);font-size:11px;text-align:center;margin-top:24px">
              © TaskFlow — Team Task Manager
            </p>
          </div>
        </body>
        </html>
      `,
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to send reset email. Please try again.' });
  }
};

// ── POST /api/auth/reset-password ────────────────────────────
// Validates the token and sets a new password.
const resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      return res.status(400).json({ error: 'Token, email and new password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Hash the incoming raw token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken:       hashedToken,
        resetTokenExpiry: { gt: new Date() }, // must not be expired
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Reset link is invalid or has expired. Please request a new one.' });
    }

    const hashed = await bcrypt.hash(password, 12);

    // Update password and clear the reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password:         hashed,
        resetToken:       null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: 'Password reset successfully. You can now sign in with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { signup, login, me, updateMe, forgotPassword, resetPassword };
