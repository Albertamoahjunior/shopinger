"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deliverer_controller_1 = __importDefault(require("../controllers/deliverer.controller"));
const router = express_1.default.Router();
router.get("/", deliverer_controller_1.default.get_deliverers);
router.get("/:id", deliverer_controller_1.default.get_deliverer_by_id);
router.post("/", deliverer_controller_1.default.add_deliverer);
router.delete("/:id", deliverer_controller_1.default.remove_deliverer);
router.put("/:id", deliverer_controller_1.default.update_deliverer);
exports.default = router;
//# sourceMappingURL=deliverer.routes.js.map