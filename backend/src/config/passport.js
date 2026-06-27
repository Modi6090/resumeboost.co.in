const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const supabase = require('./supabase');
const logger = require('./logger');

const configurePassport = () => {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientID || !clientSecret) {
        logger.warn('Google OAuth credentials not set — Google login disabled');
        return;
    }

    passport.use(
        new GoogleStrategy(
            {
                clientID,
                clientSecret,
                callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
                scope: ['profile', 'email'],
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const email = profile.emails?.[0]?.value;
                    if (!email) return done(new Error('No email from Google'), null);

                    const emailLower = email.toLowerCase();

                    // Check for existing user by googleId or email
                    let { data: user } = await supabase
                        .from('users')
                        .select('*')
                        .or(`google_id.eq.${profile.id},email.eq.${emailLower}`)
                        .maybeSingle();

                    if (user) {
                        // Update googleId if they previously registered with email+password
                        if (!user.google_id) {
                            const { data: updatedUser, error } = await supabase
                                .from('users')
                                .update({
                                    google_id: profile.id,
                                    auth_method: 'google',
                                    avatar: profile.photos?.[0]?.value || null,
                                    is_verified: true
                                })
                                .eq('id', user.id)
                                .select()
                                .single();
                            if (error) throw error;
                            user = updatedUser;
                        }
                    } else {
                        // Create new user from Google profile
                        const { data: newUser, error } = await supabase
                            .from('users')
                            .insert([{
                                name: profile.displayName || 'Google User',
                                email: emailLower,
                                google_id: profile.id,
                                avatar: profile.photos?.[0]?.value || null,
                                auth_method: 'google',
                                is_verified: true,
                            }])
                            .select()
                            .single();
                        if (error) throw error;
                        user = newUser;
                    }

                    return done(null, user);
                } catch (error) {
                    logger.error('Google OAuth error:', error);
                    return done(error, null);
                }
            }
        )
    );

    // Minimal session serialization (app uses JWT, not sessions)
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        const { data: user } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
        done(null, user);
    });
};

module.exports = configurePassport;
