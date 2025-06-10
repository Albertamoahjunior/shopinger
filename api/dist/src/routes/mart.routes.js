"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mart_controller_1 = __importDefault(require("../controllers/mart.controller"));
const router = express_1.default.Router();
router.get("/", mart_controller_1.default.get_mart_items);
router.get("/:customer_id/:product_id/:type", mart_controller_1.default.get_mart_item_by_id);
router.post("/", mart_controller_1.default.add_mart_item);
router.delete("/:customer_id/:product_id/:type", mart_controller_1.default.remove_mart_item);
router.put("/", mart_controller_1.default.update_mart_item);
exports.default = router;
//# sourceMappingURL=mart.routes.js.map