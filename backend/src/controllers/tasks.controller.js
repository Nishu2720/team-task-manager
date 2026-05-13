const prisma = require('../db/client');

const taskInclude = {
  assignee: { select: { id: true, name: true, email: true } },
  creator: { select: { id: true, name: true } },
  project: { select: { id: true, name: true, color: true } },
};

// GET /api/tasks  (global — my tasks or all if admin)
const getTasks = async (req, res) => {
  try {
    const { status, priority, projectId, search, overdue } = req.query;

    const where = {};

    // Scope: admins see all, members see tasks in their projects
    if (req.user.role !== 'ADMIN') {
      where.project = { members: { some: { userId: req.user.id } } };
    }

    if (status) where.status = status.toUpperCase();
    if (priority) where.priority = priority.toUpperCase();
    if (projectId) where.projectId = projectId;
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (overdue === 'true') {
      where.dueDate = { lt: new Date() };
      where.status = { not: 'DONE' };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: taskInclude,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/projects/:projectId/tasks
const getProjectTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    const where = { projectId: req.params.projectId };
    if (status) where.status = status.toUpperCase();
    if (priority) where.priority = priority.toUpperCase();
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const tasks = await prisma.task.findMany({
      where,
      include: taskInclude,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/projects/:projectId/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assigneeId } = req.body;
    const { projectId } = req.params;

    // Verify assignee is project member
    if (assigneeId) {
      const member = await prisma.projectMember.findUnique({
        where: { userId_projectId: { userId: assigneeId, projectId } },
      });
      if (!member) {
        return res.status(400).json({ error: 'Assignee must be a project member' });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status?.toUpperCase() || 'TODO',
        priority: priority?.toUpperCase() || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null,
        creatorId: req.user.id,
      },
      include: taskInclude,
    });
    res.status(201).json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/tasks/:taskId
const updateTask = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Members can only update their assigned tasks; admins can update any
    if (req.user.role !== 'ADMIN' && task.assigneeId !== req.user.id && task.creatorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    const { title, description, status, priority, dueDate, assigneeId } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status.toUpperCase();
    if (priority !== undefined) data.priority = priority.toUpperCase();
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    if (assigneeId !== undefined) {
      if (assigneeId) {
        const member = await prisma.projectMember.findUnique({
          where: { userId_projectId: { userId: assigneeId, projectId: task.projectId } },
        });
        if (!member) return res.status(400).json({ error: 'Assignee must be a project member' });
      }
      data.assigneeId = assigneeId || null;
    }

    const updated = await prisma.task.update({
      where: { id: req.params.taskId },
      data,
      include: taskInclude,
    });
    res.json({ task: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/tasks/:taskId
const deleteTask = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (req.user.role !== 'ADMIN' && task.creatorId !== req.user.id) {
      return res.status(403).json({ error: 'Only task creator or admin can delete' });
    }

    await prisma.task.delete({ where: { id: req.params.taskId } });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    const projectFilter = isAdmin ? {} : { members: { some: { userId } } };
    const taskFilter = isAdmin ? {} : { project: { members: { some: { userId } } } };

    const [totalProjects, tasksByStatus, overdueTasks, recentTasks] = await Promise.all([
      prisma.project.count({ where: projectFilter }),
      prisma.task.groupBy({
        by: ['status'],
        where: taskFilter,
        _count: true,
      }),
      prisma.task.count({
        where: { ...taskFilter, dueDate: { lt: new Date() }, status: { not: 'DONE' } },
      }),
      prisma.task.findMany({
        where: taskFilter,
        include: taskInclude,
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const statusMap = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    tasksByStatus.forEach((t) => (statusMap[t.status] = t._count));

    res.json({
      stats: {
        totalProjects,
        totalTasks: Object.values(statusMap).reduce((a, b) => a + b, 0),
        todo: statusMap.TODO,
        inProgress: statusMap.IN_PROGRESS,
        done: statusMap.DONE,
        overdue: overdueTasks,
      },
      recentTasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTasks, getProjectTasks, createTask, updateTask, deleteTask, getDashboard };
