import express, { Router } from 'express';
const router: Router = express.Router();

import authRoutes from "../src/routes/auth.routes";
import userRoutes from "../src/routes/user.routes";
import customerRoutes from "../src/routes/customer.routes";
import delivererRoutes from "../src/routes/deliverer.routes";
import inventoryRoutes from "../src/routes/inventory.routes";
import martRoutes from "../src/routes/mart.routes";
import recieptRoutes from "../src/routes/reciept.routes";
import saleRoutes from "../src/routes/sale.routes";
import supplierRoutes from "../src/routes/supplier.routes";
import tellerRoutes from "../src/routes/teller.routes";
import workerRoutes from "../src/routes/worker.routes";
import profileRoutes from "../src/routes/profile.routes";

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/customers", customerRoutes);
router.use("/deliverers", delivererRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/mart", martRoutes);
router.use("/reciepts", recieptRoutes);
router.use("/sales", saleRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/tellers", tellerRoutes);
router.use("/workers", workerRoutes);

export default router;
