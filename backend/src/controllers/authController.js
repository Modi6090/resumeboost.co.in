const supabase = require('../config/supabase');
const logger = require('../config/logger');

// ─── HELPERS ─────────────────────────────────────────────────────────
const userPayload = (user) => ({
    _id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || null,
    avatar: user.avatar || null,
    plan: user.plan || 'free',
    scansUsed: user.scans_used || 0,
    scanLimit: user.scan_limit || 3,
    authMethod: user.auth_method || 'supabase',
});

// ─── GET CURRENT USER PROFILE ─────────────────────────────────────────
// Called by frontend after Supabase Auth login to get profile data
const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (!user) {
            // Auto-create profile row if it doesn't exist yet
            // (handles first login after Supabase Auth signup)
            const authUser = req.user;
            const { data: newUser, error } = await supabase
                .from('users')
                .insert([{
                    id: authUser.id,
                    name: authUser.name || authUser.email?.split('@')[0] || 'User',
                    email: authUser.email,
                    auth_method: 'supabase',
                    is_verified: true,
                }])
                .select()
                .single();

            if (error) {
                logger.error('Auto-create profile error:', error);
                return res.status(500).json({ message: 'Failed to create user profile' });
            }

            return res.json(userPayload(newUser));
        }

        res.json(userPayload(user));
    } catch (error) {
        logger.error('getMe error:', error);
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
};

// ─── GOOGLE OAUTH CALLBACK (Passport.js) ──────────────────────────────
// Only used if Google OAuth is configured via Passport on the backend.
// Frontend Google OAuth goes through Supabase directly and doesn't hit this.
const googleCallback = (req, res) => {
    try {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        // After Passport processes Google OAuth, redirect back to frontend
        // The frontend AuthContext will pick up the session
        res.redirect(`${frontendUrl}/dashboard`);
    } catch (error) {
        logger.error('Google callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}/login?error=google_failed`);
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // 1. Delete user from custom 'users' table
        // (If foreign keys have ON DELETE CASCADE, this might also delete analyses)
        await supabase.from('users').delete().eq('id', userId);
        
        // 2. Delete auth user via Admin API (requires SERVICE_ROLE key)
        // If we don't have the service role key, we can at least delete the profile data
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
        if (serviceKey && supabase.auth.admin) {
             await supabase.auth.admin.deleteUser(userId);
        }

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        logger.error('Delete account error:', error);
        res.status(500).json({ message: 'Failed to delete account' });
    }
};

module.exports = { getMe, googleCallback, deleteAccount };
