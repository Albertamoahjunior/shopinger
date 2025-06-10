import express, { Router } from "express";
import workerController from "../controllers/worker.controller";
const router: Router = express.Router();

router.get("/", workerController.get_workers as express.RequestHandler);
router.get("/:id", workerController.get_worker_by_id as express.RequestHandler);
router.post("/", workerController.add_worker as express.RequestHandler);
router.delete("/:id", workerController.remove_worker as express.RequestHandler);
router.put("/:id", workerController.update_worker as express.RequestHandler);

export default router;
