import express, { Router } from "express";
import martController from "../controllers/mart.controller";
const router: Router = express.Router();

router.get("/:customerId", martController.getCart);
router.post("/", martController.addItemToCart);
router.put("/", martController.updateCartItemQty);
router.delete("/:customerId/:productId", martController.removeItemFromCart);

export default router;
