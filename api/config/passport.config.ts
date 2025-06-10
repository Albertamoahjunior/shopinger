import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient, UserRole, Prisma } from '@prisma/client';
import { compare_pass } from './auth.config';
import { findUserById, findUserByEmail, createUser } from '../src/services/user.services';

// Define a type for User including its profile relation
type UserWithProfile = Prisma.UserGetPayload<{
    include: { profile: true }
}>;

const prisma = new PrismaClient();

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await findUserById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await findUserByEmail(email);
        if (!user || !user.is_active) {
            return done(null, false, { message: 'Incorrect email or user is inactive.' });
        }

        if (!user.password) {
            return done(null, false, { message: 'User registered via OAuth, please use Google login.' });
        }

        const isValidPassword = compare_pass(password, user.password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await prisma.user.findUnique({
            where: { email: profile.emails![0].value },
            include: { profile: true }
        });

        if (user) {
            // Update existing user with Google ID if not already set
            if (!user.googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId: profile.id, provider: 'google' },
                    include: {
                        profile: true
                    }
                });
            }
            return done(null, user);
        } else {
            // Create new user if not found
            const newUser = await createUser({
                email: profile.emails![0].value,
                password: '', // No password for OAuth users
                first_name: profile.name?.givenName || '',
                last_name: profile.name?.familyName || '',
                role: UserRole.CUSTOMER, // Default role for new OAuth users
                googleId: profile.id,
                profile_data: profile._json, // Store full profile data
            });
            return done(null, newUser);
        }
    } catch (error) {
        return done(error as Error, undefined);
    }
}));

export default passport;
