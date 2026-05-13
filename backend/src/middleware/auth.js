const jwt = require('jsonwebtoken');
const prisma = require('../db/client');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // BUG FIX 4: always fetch fresh user from DB so role changes (e.g. admin
    // promoting a member) are reflected immediately without requiring re-login.
    // Never trust the role stored inside the JWT payload for access decisions.
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const requireProjectAccess = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return next();
    if (req.user.role === 'ADMIN') return next();

    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: req.user.id, projectId } },
    });

    if (!membership) {
      return res.status(403).json({ error: 'Not a project member' });
    }
    next();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { authenticate, requireAdmin, requireProjectAccess };
