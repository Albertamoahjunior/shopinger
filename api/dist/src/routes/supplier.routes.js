"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supplier_controller_1 = __importDefault(require("../controllers/supplier.controller"));
const router = express_1.default.Router();
router.get("/", supplier_controller_1.default.get_suppliers);
router.get("/:supplier_name", supplier_controller_1.default.get_supplier_by_id);
router.post("/", supplier_controller_1.default.add_supplier);
router.delete("/:supplier_name", supplier_controller_1.default.remove_supplier);
router.put("/:supplier_name", supplier_controller_1.default.update_supplier);
exports.default = router;
//# sourceMappingURL=supplier.routes.js.map