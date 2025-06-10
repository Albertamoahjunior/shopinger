import express, { Router } from "express";
import inventoryController from "../controllers/inventory.controller";
const router: Router = express.Router();

router.get("/", inventoryController.get_inventory as express.RequestHandler);
router.get("/all", inventoryController.get_inventory as express.RequestHandler);
router.get("/prod/:product_id", inventoryController.get_inventory_by_id as express.RequestHandler);
router.get("/:product_id", inventoryController.get_inventory_by_id as express.RequestHandler);
router.post("/", inventoryController.add_inventory as express.RequestHandler);
router.delete("/:product_id", inventoryController.remove_inventory as express.RequestHandler);
router.put("/:product_id", inventoryController.update_inventory as express.RequestHandler);
router.post("/image", inventoryController.add_inventory_image as express.RequestHandler);
router.get("/search/:query", inventoryController.search_product as express.RequestHandler);

export default router;
