import express, { Router } from "express";
import tellerController from "../controllers/teller.controller";
const router: Router = express.Router();

router.get("/", tellerController.get_tellers as express.RequestHandler);
router.get("/:teller_id", tellerController.get_teller_by_id as express.RequestHandler);
router.post("/", tellerController.add_teller as express.RequestHandler);
router.delete("/:teller_id", tellerController.remove_teller as express.RequestHandler);
router.put("/:teller_id", tellerController.update_teller as express.RequestHandler);

export default router;
