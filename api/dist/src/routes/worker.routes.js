"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const worker_controller_1 = __importDefault(require("../controllers/worker.controller"));
const router = express_1.default.Router();
router.get("/", worker_controller_1.default.get_workers);
router.get("/:id", worker_controller_1.default.get_worker_by_id);
router.post("/", worker_controller_1.default.add_worker);
router.delete("/:id", worker_controller_1.default.remove_worker);
router.put("/:id", worker_controller_1.default.update_worker);
exports.default = router;
//# sourceMappingURL=worker.routes.js.map