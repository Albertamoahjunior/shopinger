import express, { Router, Request, Response } from "express";
import saleController from "../controllers/sale.controller";
const router: Router = express.Router();

router.get("/", saleController.get_sales as express.RequestHandler);
router.get("/:sale_id", saleController.get_sale_by_id as express.RequestHandler);
router.post("/", saleController.add_sale as express.RequestHandler);
router.delete("/:sale_id", saleController.remove_sale as express.RequestHandler);
router.put("/:sale_id", saleController.update_sale as express.RequestHandler);

export default router;
