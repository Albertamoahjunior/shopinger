"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sale_controller_1 = __importDefault(require("../controllers/sale.controller"));
const router = express_1.default.Router();
router.get("/", sale_controller_1.default.get_sales);
router.get("/:sale_id", sale_controller_1.default.get_sale_by_id);
router.post("/", sale_controller_1.default.add_sale);
router.delete("/:sale_id", sale_controller_1.default.remove_sale);
router.put("/:sale_id", sale_controller_1.default.update_sale);
exports.default = router;
//# sourceMappingURL=sale.routes.js.map