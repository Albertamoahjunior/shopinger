"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_routes_1 = __importDefault(require("../src/routes/auth.routes"));
const customer_routes_1 = __importDefault(require("../src/routes/customer.routes"));
const deliverer_routes_1 = __importDefault(require("../src/routes/deliverer.routes"));
const inventory_routes_1 = __importDefault(require("../src/routes/inventory.routes"));
const mart_routes_1 = __importDefault(require("../src/routes/mart.routes"));
const reciept_routes_1 = __importDefault(require("../src/routes/reciept.routes"));
const sale_routes_1 = __importDefault(require("../src/routes/sale.routes"));
const supplier_routes_1 = __importDefault(require("../src/routes/supplier.routes"));
const teller_routes_1 = __importDefault(require("../src/routes/teller.routes"));
const worker_routes_1 = __importDefault(require("../src/routes/worker.routes"));
router.use("/auth", auth_routes_1.default);
router.use("/customers", customer_routes_1.default);
router.use("/deliverers", deliverer_routes_1.default);
router.use("/inventory", inventory_routes_1.default);
router.use("/mart", mart_routes_1.default);
router.use("/reciepts", reciept_routes_1.default);
router.use("/sales", sale_routes_1.default);
router.use("/suppliers", supplier_routes_1.default);
router.use("/tellers", teller_routes_1.default);
router.use("/workers", worker_routes_1.default);
exports.default = router;
//# sourceMappingURL=routes.js.map