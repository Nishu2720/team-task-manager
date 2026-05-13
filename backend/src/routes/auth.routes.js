<<<<<<< HEAD
const router  = require('express').Router();
const { body } = require('express-validator');
const {
  signup, login, me, updateMe,
  forgotPassword, resetPassword,
} = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate }     = require('../middleware/validate');
=======
const router = require('express').Router();
const { body } = require('express-validator');
const { signup, login, me, updateMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90

router.post(
  '/signup',
  [
<<<<<<< HEAD
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
=======
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
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
<<<<<<< HEAD
  login,
);

router.get('/me',  authenticate, me);
=======
  login
);

router.get('/me', authenticate, me);
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
router.patch(
  '/me',
  authenticate,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
<<<<<<< HEAD
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
=======
    body('password').optional().isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  validate,
  updateMe
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
);

module.exports = router;
