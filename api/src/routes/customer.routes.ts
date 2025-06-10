import express, { Router } from "express";
import customerController from "../controllers/customer.controller";
const router: Router = express.Router();

router.get("/", customerController.get_customers as express.RequestHandler);
router.get("/:id", customerController.get_customer_by_id as express.RequestHandler);
router.post("/", customerController.add_customer as express.RequestHandler);
router.delete("/:id", customerController.remove_customer as express.RequestHandler);
router.put("/:id", customerController.update_customer as express.RequestHandler);

export default router;
