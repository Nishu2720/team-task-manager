const router = require('express').Router();
const { body } = require('express-validator');
const {
  getProjects, getProject, createProject, updateProject,
  deleteProject, addMember, removeMember,
} = require('../controllers/projects.controller');
const { getProjectTasks, createTask } = require('../controllers/tasks.controller');
const { authenticate, requireAdmin, requireProjectAccess } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(authenticate);

router.get('/', getProjects);

router.post(
  '/',
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Project name required'),
    body('color').optional().isHexColor().withMessage('Invalid color'),
  ],
  validate,
  createProject
);

router.get('/:projectId', requireProjectAccess, getProject);

router.patch(
  '/:projectId',
  requireProjectAccess,
  [body('name').optional().trim().notEmpty()],
  validate,
  updateProject
);

router.delete('/:projectId', requireProjectAccess, deleteProject);

// Members
router.post(
  '/:projectId/members',
  requireProjectAccess,
  [body('email').isEmail().normalizeEmail()],
  validate,
  addMember
);

router.delete('/:projectId/members/:userId', requireProjectAccess, removeMember);

// Tasks nested under project
router.get('/:projectId/tasks', requireProjectAccess, getProjectTasks);

router.post(
  '/:projectId/tasks',
  requireProjectAccess,
  [
    body('title').trim().notEmpty().withMessage('Task title required'),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
  ],
  validate,
  createTask
);

module.exports = router;
