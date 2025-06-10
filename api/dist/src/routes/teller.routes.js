"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teller_controller_1 = __importDefault(require("../controllers/teller.controller"));
const router = express_1.default.Router();
router.get("/", teller_controller_1.default.get_tellers);
router.get("/:teller_id", teller_controller_1.default.get_teller_by_id);
router.post("/", teller_controller_1.default.add_teller);
router.delete("/:teller_id", teller_controller_1.default.remove_teller);
router.put("/:teller_id", teller_controller_1.default.update_teller);
exports.default = router;
//# sourceMappingURL=teller.routes.js.map