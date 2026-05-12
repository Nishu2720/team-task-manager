const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db/client');

const signToken = (userId, role) =>
  jwt.sign(
    { userId, role },              // ← BUG FIX 1: include role in JWT payload
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
};

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 12);

    // ── BUG FIX 2: the old logic silently blocked ADMIN registration once ANY
    // admin existed, regardless of who was signing up. This meant that after
    // the first admin was seeded, ALL subsequent signups — even those explicitly
    // choosing Admin — were silently downgraded to MEMBER with no error shown.
    //
    // Correct policy:
    //   • Anyone can choose their role during self-registration.
    //   • ADMIN role is always accepted as-is from the signup form.
    //   • If no role is sent, default to MEMBER.
    //   • An existing admin can later demote/promote via the Team page.
    // ──────────────────────────────────────────────────────────────────────────
    const normalizedRole = (role || 'MEMBER').toUpperCase();
    const assignedRole = ['ADMIN', 'MEMBER'].includes(normalizedRole)
      ? normalizedRole
      : 'MEMBER';

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

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user.id, user.role); // ← include role in token
    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/auth/me
const me = async (req, res) => {
  // req.user is set by authenticate middleware — always fresh from DB
  res.json({ user: req.user });
};

// PATCH /api/auth/me
const updateMe = async (req, res) => {
  try {
    const { name, password } = req.body;
    const data = {};
    if (name) data.name = name;
    if (password) data.password = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: userSelect,
    });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { signup, login, me, updateMe };
