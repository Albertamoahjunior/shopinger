"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inventory_controller_1 = __importDefault(require("../controllers/inventory.controller"));
const router = express_1.default.Router();
router.get("/", inventory_controller_1.default.get_inventory);
router.get("/:product_id", inventory_controller_1.default.get_inventory_by_id);
router.post("/", inventory_controller_1.default.add_inventory);
router.delete("/:product_id", inventory_controller_1.default.remove_inventory);
router.put("/:product_id", inventory_controller_1.default.update_inventory);
router.post("/image", inventory_controller_1.default.add_inventory_image);
router.get("/search/:query", inventory_controller_1.default.search_product);
exports.default = router;
//# sourceMappingURL=inventory.routes.js.map