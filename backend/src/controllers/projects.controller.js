const prisma = require('../db/client');

const projectInclude = {
  owner: { select: { id: true, name: true, email: true } },
  members: {
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  },
  _count: { select: { tasks: true } },
};

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const where =
      req.user.role === 'ADMIN'
        ? {}
        : { members: { some: { userId: req.user.id } } };

    const projects = await prisma.project.findMany({
      where,
      include: projectInclude,
      orderBy: { createdAt: 'desc' },
    });

    // Attach task stats to each project
    const enriched = await Promise.all(
      projects.map(async (p) => {
        const tasks = await prisma.task.groupBy({
          by: ['status'],
          where: { projectId: p.id },
          _count: true,
        });
        const stats = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
        tasks.forEach((t) => (stats[t.status] = t._count));
        return { ...p, taskStats: stats };
      })
    );

    res.json({ projects: enriched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/projects/:projectId
const getProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.projectId },
      include: { ...projectInclude, tasks: { include: { assignee: { select: { id: true, name: true, email: true } }, creator: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } } },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        color: color || '#7c6ff7',
        ownerId: req.user.id,
        members: { create: { userId: req.user.id } },
      },
      include: projectInclude,
    });
    res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/projects/:projectId
const updateProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const project = await prisma.project.findUnique({ where: { id: req.params.projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only project owner or admin can update' });
    }

    const updated = await prisma.project.update({
      where: { id: req.params.projectId },
      data: { name, description, color },
      include: projectInclude,
    });
    res.json({ project: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/projects/:projectId
const deleteProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only project owner or admin can delete' });
    }

    await prisma.project.delete({ where: { id: req.params.projectId } });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/projects/:projectId/members
const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await prisma.project.findUnique({ where: { id: req.params.projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only owner or admin can add members' });
    }

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) return res.status(404).json({ error: 'User not found' });

    const existing = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: userToAdd.id, projectId: project.id } },
    });
    if (existing) return res.status(409).json({ error: 'Already a member' });

    await prisma.projectMember.create({
      data: { userId: userToAdd.id, projectId: project.id },
    });

    const updated = await prisma.project.findUnique({
      where: { id: project.id },
      include: projectInclude,
    });
    res.json({ project: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/projects/:projectId/members/:userId
const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only owner or admin can remove members' });
    }
    if (userId === project.ownerId) {
      return res.status(400).json({ error: 'Cannot remove project owner' });
    }

    await prisma.projectMember.delete({
      where: { userId_projectId: { userId, projectId } },
    });
    res.json({ message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, addMember, removeMember };
