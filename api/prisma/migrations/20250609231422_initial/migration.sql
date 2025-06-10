-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "address" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "mobile_number" TEXT,
    "customerId" INTEGER NOT NULL,
    "priority" TEXT,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "tel_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "log_date" DATE DEFAULT CURRENT_TIMESTAMP,
    "log_time" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "delivery_id" SERIAL NOT NULL,
    "deliverer_id" INTEGER NOT NULL,
    "delivery_report" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "delivery_time" DATE,
    "customer_report" TEXT,
    "receipt_id" INTEGER,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("delivery_id")
);

-- CreateTable
CREATE TABLE "DeliveryTimetable" (
    "deliverer_id" INTEGER NOT NULL,
    "day_of_work" TEXT NOT NULL,

    CONSTRAINT "DeliveryTimetable_pkey" PRIMARY KEY ("deliverer_id","day_of_work")
);

-- CreateTable
CREATE TABLE "images" (
    "image" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("product_id","image")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_qty" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "product_price" DECIMAL(10,2) NOT NULL,
    "prod_desc" TEXT,
    "prod_spec" TEXT,
    "category" TEXT,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "ItemImageMap" (
    "item_id" TEXT NOT NULL,
    "item_image" TEXT NOT NULL,

    CONSTRAINT "ItemImageMap_pkey" PRIMARY KEY ("item_id","item_image")
);

-- CreateTable
CREATE TABLE "Mart" (
    "customer_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "qty" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mart_pkey" PRIMARY KEY ("customer_id","product_id","type")
);

-- CreateTable
CREATE TABLE "receipts" (
    "receipt_id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "teller_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(10,2),
    "log_date" DATE DEFAULT CURRENT_TIMESTAMP,
    "log_time" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("receipt_id")
);

-- CreateTable
CREATE TABLE "Session" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(6),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "Sold" (
    "sold_id" SERIAL NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_qty" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "mode" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "receipt_id" INTEGER,
    "log_date" DATE DEFAULT CURRENT_TIMESTAMP,
    "log_time" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sold_pkey" PRIMARY KEY ("sold_id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "supplier_id" SERIAL NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "contact" TEXT,
    "email" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "SupplierProduct" (
    "item_id" TEXT NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "cost_price" DECIMAL(10,2),

    CONSTRAINT "SupplierProduct_pkey" PRIMARY KEY ("item_id","supplier_id")
);

-- CreateTable
CREATE TABLE "Teller" (
    "teller_id" INTEGER NOT NULL,
    "teller_log_code" SERIAL NOT NULL,
    "log_date" DATE DEFAULT CURRENT_TIMESTAMP,
    "t_arrival" TIME(0),
    "t_depart" TIME(0),
    "hours_worked" DECIMAL(4,2),

    CONSTRAINT "Teller_pkey" PRIMARY KEY ("teller_log_code")
);

-- CreateTable
CREATE TABLE "Workers" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "dob" DATE NOT NULL,
    "id_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tel_number" TEXT NOT NULL,
    "hire_date" DATE DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Workers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "address_customerId_key" ON "address"("customerId");

-- CreateIndex
CREATE INDEX "address_customerId_idx" ON "address"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE INDEX "customers_email_idx" ON "customers"("email");

-- CreateIndex
CREATE INDEX "Delivery_deliverer_id_idx" ON "Delivery"("deliverer_id");

-- CreateIndex
CREATE INDEX "Delivery_customer_id_idx" ON "Delivery"("customer_id");

-- CreateIndex
CREATE INDEX "Delivery_receipt_id_idx" ON "Delivery"("receipt_id");

-- CreateIndex
CREATE INDEX "DeliveryTimetable_deliverer_id_idx" ON "DeliveryTimetable"("deliverer_id");

-- CreateIndex
CREATE INDEX "images_product_id_idx" ON "images"("product_id");

-- CreateIndex
CREATE INDEX "Inventory_supplier_id_idx" ON "Inventory"("supplier_id");

-- CreateIndex
CREATE INDEX "Inventory_category_idx" ON "Inventory"("category");

-- CreateIndex
CREATE INDEX "Inventory_product_name_idx" ON "Inventory"("product_name");

-- CreateIndex
CREATE INDEX "ItemImageMap_item_id_idx" ON "ItemImageMap"("item_id");

-- CreateIndex
CREATE INDEX "Mart_customer_id_idx" ON "Mart"("customer_id");

-- CreateIndex
CREATE INDEX "Mart_product_id_idx" ON "Mart"("product_id");

-- CreateIndex
CREATE INDEX "receipts_customer_id_idx" ON "receipts"("customer_id");

-- CreateIndex
CREATE INDEX "receipts_teller_id_idx" ON "receipts"("teller_id");

-- CreateIndex
CREATE INDEX "receipts_log_date_idx" ON "receipts"("log_date");

-- CreateIndex
CREATE INDEX "Session_expire_idx" ON "Session"("expire");

-- CreateIndex
CREATE INDEX "Sold_product_id_idx" ON "Sold"("product_id");

-- CreateIndex
CREATE INDEX "Sold_receipt_id_idx" ON "Sold"("receipt_id");

-- CreateIndex
CREATE INDEX "Sold_log_date_idx" ON "Sold"("log_date");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplier_name_key" ON "Supplier"("supplier_name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_email_key" ON "Supplier"("email");

-- CreateIndex
CREATE INDEX "Supplier_supplier_name_idx" ON "Supplier"("supplier_name");

-- CreateIndex
CREATE INDEX "SupplierProduct_supplier_id_idx" ON "SupplierProduct"("supplier_id");

-- CreateIndex
CREATE INDEX "SupplierProduct_item_id_idx" ON "SupplierProduct"("item_id");

-- CreateIndex
CREATE INDEX "Teller_teller_id_idx" ON "Teller"("teller_id");

-- CreateIndex
CREATE INDEX "Teller_log_date_idx" ON "Teller"("log_date");

-- CreateIndex
CREATE UNIQUE INDEX "Workers_id_number_key" ON "Workers"("id_number");

-- CreateIndex
CREATE UNIQUE INDEX "Workers_email_key" ON "Workers"("email");

-- CreateIndex
CREATE INDEX "Workers_email_idx" ON "Workers"("email");

-- CreateIndex
CREATE INDEX "Workers_role_idx" ON "Workers"("role");

-- CreateIndex
CREATE INDEX "Workers_id_number_idx" ON "Workers"("id_number");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_deliverer_id_fkey" FOREIGN KEY ("deliverer_id") REFERENCES "Workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("receipt_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryTimetable" ADD CONSTRAINT "DeliveryTimetable_deliverer_id_fkey" FOREIGN KEY ("deliverer_id") REFERENCES "Workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Inventory"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemImageMap" ADD CONSTRAINT "ItemImageMap_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Inventory"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mart" ADD CONSTRAINT "Mart_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mart" ADD CONSTRAINT "Mart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Inventory"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_teller_id_fkey" FOREIGN KEY ("teller_id") REFERENCES "Workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Inventory"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sold" ADD CONSTRAINT "Sold_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("receipt_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("supplier_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teller" ADD CONSTRAINT "Teller_teller_id_fkey" FOREIGN KEY ("teller_id") REFERENCES "Workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
