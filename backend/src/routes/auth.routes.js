const router = require('express').Router();
const { body } = require('express-validator');
const { signup, login, me, updateMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.post(
  '/signup',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required'),
    body('email')
      .isEmail().withMessage('Valid email required')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    // BUG FIX 3: validator was marking role optional but not normalising case,
    // so 'admin' (lowercase from some frontends) would pass validation but then
    // fail the Prisma enum check and crash with a 500 instead of being accepted.
    // Now we sanitise to uppercase before the enum check runs.
    body('role')
      .optional()
      .customSanitizer((v) => (v ? v.toString().toUpperCase() : 'MEMBER'))
      .isIn(['ADMIN', 'MEMBER']).withMessage('Role must be ADMIN or MEMBER'),
  ],
  validate,
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  login
);

router.get('/me', authenticate, me);
router.patch(
  '/me',
  authenticate,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  validate,
  updateMe
);

module.exports = router;
