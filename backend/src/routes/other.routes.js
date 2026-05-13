const router = require('express').Router();
const { body } = require('express-validator');
const { getTasks, updateTask, deleteTask, getDashboard } = require('../controllers/tasks.controller');
const { getUsers, updateRole, deleteUser } = require('../controllers/users.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// ── Task routes ──────────────────────────────────────────────
const taskRouter = require('express').Router();
taskRouter.use(authenticate);

taskRouter.get('/', getTasks);

taskRouter.patch(
  '/:taskId',
  [
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
  ],
  validate,
  updateTask
);

taskRouter.delete('/:taskId', deleteTask);

// ── User routes ──────────────────────────────────────────────
const userRouter = require('express').Router();
userRouter.use(authenticate, requireAdmin);

userRouter.get('/', getUsers);
userRouter.patch('/:userId/role', [body('role').isIn(['ADMIN', 'MEMBER'])], validate, updateRole);
userRouter.delete('/:userId', deleteUser);

// ── Dashboard route ──────────────────────────────────────────
const dashRouter = require('express').Router();
dashRouter.use(authenticate);
dashRouter.get('/', getDashboard);

module.exports = { taskRouter, userRouter, dashRouter };
