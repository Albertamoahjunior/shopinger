import express, { Router } from "express";
import profileController from "../controllers/profile.controller";

const router: Router = express.Router();

// Get current user's profile (requires authentication)
router.get("/me", profileController.getCurrentUserProfile as express.RequestHandler);

// Get profile by user ID
router.get("/:userId", profileController.getProfile as express.RequestHandler);

// Update profile by user ID
router.put("/:userId", profileController.updateProfile as express.RequestHandler);

// Get profiles by role
router.get("/role/:role", profileController.getProfilesByRole as express.RequestHandler);

// Get users by role
router.get("/users/role/:role", profileController.getUsersByRole as express.RequestHandler);

// Address management routes
router.post("/:userId/addresses", profileController.createAddress as express.RequestHandler);
router.put("/addresses/:addressId", profileController.updateAddress as express.RequestHandler);
router.delete("/addresses/:addressId", profileController.deleteAddress as express.RequestHandler);

export default router;
