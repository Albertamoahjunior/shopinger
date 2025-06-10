import express, { Router } from "express";
import recieptController from "../controllers/reciept.controller";
const router: Router = express.Router();

router.get("/", recieptController.get_reciepts as express.RequestHandler);
router.get("/:reciept_id", recieptController.get_reciept_by_id as express.RequestHandler);
router.post("/", recieptController.add_reciept as express.RequestHandler);
router.delete("/:reciept_id", recieptController.remove_reciept as express.RequestHandler);

export default router;
