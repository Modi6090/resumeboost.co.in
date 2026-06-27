const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const token = authHeader.split(' ')[1];

        // Verify the token using Supabase Auth
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }

        // Fetch additional profile data if present
        const { data: profile } = await supabase
            .from('users')
            .select('id, name, email, phone, avatar, auth_method, plan, scans_used, scan_limit, is_verified')
            .eq('id', authUser.id)
            .maybeSingle();

        // Set user on req. If no profile exists yet, fallback to authUser
        req.user = profile || {
            id: authUser.id,
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0],
            email: authUser.email,
            plan: 'free',
            scans_used: 0,
            scan_limit: 3,
        };

        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protect };
