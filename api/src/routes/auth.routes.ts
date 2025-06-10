import express, { Router } from "express";
import passport from "passport";
import authController from "../controllers/auth.controller";

const router: Router = express.Router();

// Unified login route (works for all user types)
router.post("/login", authController.login as express.RequestHandler);

// Unified registration route (works for all user types)
router.post("/register", authController.register as express.RequestHandler);

// Customer-specific signup route (for backward compatibility)
router.post("/signup", authController.sign_up_customer as express.RequestHandler);
router.post("/signup/customer", authController.sign_up_customer as express.RequestHandler);

// Passport Local Strategy login
router.post("/local", passport.authenticate('local'), authController.passport_login as express.RequestHandler);

// Google OAuth routes
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/google/callback", passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);

// Logout route
router.post("/logout", authController.log_out as express.RequestHandler);
router.get("/logout", authController.log_out as express.RequestHandler);

export default router;
