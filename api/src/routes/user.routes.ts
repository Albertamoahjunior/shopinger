import express, { Router } from "express";
import userController from "../controllers/user.controller";

const router: Router = express.Router();

// Get all users with pagination
router.get("/", userController.getUsers as express.RequestHandler);

// Create a new user
router.post("/", userController.createNewUser as express.RequestHandler);

// Get user by ID
router.get("/:userId", userController.getUserById as express.RequestHandler);

// Update user by ID
router.put("/:userId", userController.updateUserById as express.RequestHandler);

// Delete (deactivate) user by ID
router.delete("/:userId", userController.deleteUserById as express.RequestHandler);

// Get user by email
router.get("/email/:email", userController.getUserByEmail as express.RequestHandler);

// Check if user exists by email
router.get("/exists/:email", userController.checkUserExists as express.RequestHandler);

// Get users by role
router.get("/role/:role", userController.getUsersByRoleController as express.RequestHandler);

export default router;
