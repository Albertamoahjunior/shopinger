import express, { Router } from "express";
import supplierController from "../controllers/supplier.controller";
const router: Router = express.Router();

router.get("/", supplierController.get_suppliers as express.RequestHandler);
router.get("/:supplier_name", supplierController.get_supplier_by_id as express.RequestHandler);
router.post("/", supplierController.add_supplier as express.RequestHandler);
router.delete("/:supplier_name", supplierController.remove_supplier as express.RequestHandler);
router.put("/:supplier_name", supplierController.update_supplier as express.RequestHandler);

export default router;
