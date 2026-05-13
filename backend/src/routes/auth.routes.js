const router  = require('express').Router();
const { body } = require('express-validator');
const {
  signup, login, me, updateMe,
  forgotPassword, resetPassword,
} = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate }     = require('../middleware/validate');

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
    body('role')
      .optional()
      .customSanitizer(v => (v ? v.toString().toUpperCase() : 'MEMBER'))
      .isIn(['ADMIN', 'MEMBER']).withMessage('Role must be ADMIN or MEMBER'),
  ],
  validate,
  signup,
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  login,
);

router.get('/me',  authenticate, me);
router.patch(
  '/me',
  authenticate,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('password').optional().isLength({ min: 6 }).withMessage('Min 6 chars'),
  ],
  validate,
  updateMe,
);

// ── Password reset ────────────────────────────────────────────
router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  ],
  validate,
  forgotPassword,
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
  ],
  validate,
  resetPassword,
);

module.exports = router;
