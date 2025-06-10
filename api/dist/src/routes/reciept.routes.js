"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reciept_controller_1 = __importDefault(require("../controllers/reciept.controller"));
const router = express_1.default.Router();
router.get("/", reciept_controller_1.default.get_reciepts);
router.get("/:reciept_id", reciept_controller_1.default.get_reciept_by_id);
router.post("/", reciept_controller_1.default.add_reciept);
router.delete("/:reciept_id", reciept_controller_1.default.remove_reciept);
exports.default = router;
//# sourceMappingURL=reciept.routes.js.map