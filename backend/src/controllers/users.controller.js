const prisma = require('../db/client');

const userSelect = { id: true, name: true, email: true, role: true, createdAt: true };

// GET /api/users  (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        ...userSelect,
        _count: { select: { assignedTasks: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/users/:userId/role  (admin only)
const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['ADMIN', 'MEMBER'].includes(role)) {
      return res.status(400).json({ error: 'Role must be ADMIN or MEMBER' });
    }
    if (req.params.userId === req.user.id) {
      return res.status(400).json({ error: "Cannot change your own role" });
    }

    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { role },
      select: userSelect,
    });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/users/:userId  (admin only)
const deleteUser = async (req, res) => {
  try {
    if (req.params.userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    await prisma.user.delete({ where: { id: req.params.userId } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getUsers, updateRole, deleteUser };
