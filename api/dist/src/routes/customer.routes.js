"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_controller_1 = __importDefault(require("../controllers/customer.controller"));
const router = express_1.default.Router();
router.get("/", customer_controller_1.default.get_customers);
router.get("/:id", customer_controller_1.default.get_customer_by_id);
router.post("/", customer_controller_1.default.add_customer);
router.delete("/:id", customer_controller_1.default.remove_customer);
router.put("/:id", customer_controller_1.default.update_customer);
exports.default = router;
//# sourceMappingURL=customer.routes.js.map