const express = require('express');
const router = express.Router();
const passport = require('passport');
const { protect } = require('../middleware/authMiddleware');
const { getMe, googleCallback, deleteAccount } = require('../controllers/authController');

// ─── GOOGLE OAUTH ROUTES ────────────────────────────────────────────
// Only active if GOOGLE_CLIENT_ID + SECRET are set in .env
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/login?error=google_failed`,
    }),
    googleCallback
);

// ─── PROTECTED ──────────────────────────────────────────────────────
// Frontend calls this after Supabase Auth login to get/create profile
router.get('/me', protect, getMe);
router.delete('/me', protect, deleteAccount);

module.exports = router;
