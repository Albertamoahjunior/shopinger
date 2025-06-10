import express, { Router } from "express";
import delivererController from "../controllers/deliverer.controller";
const router: Router = express.Router();

router.get("/", delivererController.get_deliverers as express.RequestHandler);
router.get("/:id", delivererController.get_deliverer_by_id as express.RequestHandler);
router.post("/", delivererController.add_deliverer as express.RequestHandler);
router.delete("/:id", delivererController.remove_deliverer as express.RequestHandler);
router.put("/:id", delivererController.update_deliverer as express.RequestHandler);

export default router;
