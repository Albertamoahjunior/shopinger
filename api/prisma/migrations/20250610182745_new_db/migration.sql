/*
  Warnings:

  - You are about to drop the column `customer_id` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `deliverer_id` on the `Delivery` table. All the data in the column will be lost.
  - The primary key for the `DeliveryTimetable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deliverer_id` on the `DeliveryTimetable` table. All the data in the column will be lost.
  - The primary key for the `Mart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customer_id` on the `Mart` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `teller_id` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the `Teller` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customer_user_id` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliverer_user_id` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliverer_user_id` to the `DeliveryTimetable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_user_id` to the `Mart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_email` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_user_id` to the `receipts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teller_user_id` to the `receipts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN', 'TELLER', 'DELIVERER', 'SUPPLIER_CONTACT');

-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_deliverer_id_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryTimetable" DROP CONSTRAINT "DeliveryTimetable_deliverer_id_fkey";

-- DropForeignKey
ALTER TABLE "Mart" DROP CONSTRAINT "Mart_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "Teller" DROP CONSTRAINT "Teller_teller_id_fkey";

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_customerId_fkey";

-- DropForeignKey
ALTER TABLE "receipts" DROP CONSTRAINT "receipts_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "receipts" DROP CONSTRAINT "receipts_teller_id_fkey";

-- DropIndex
DROP INDEX "Delivery_customer_id_idx";

-- DropIndex
DROP INDEX "Delivery_deliverer_id_idx";

-- DropIndex
DROP INDEX "DeliveryTimetable_deliverer_id_idx";

-- DropIndex
DROP INDEX "Mart_customer_id_idx";

-- DropIndex
DROP INDEX "receipts_customer_id_idx";

-- DropIndex
DROP INDEX "receipts_teller_id_idx";

-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "customer_id",
DROP COLUMN "deliverer_id",
ADD COLUMN     "customer_user_id" INTEGER NOT NULL,
ADD COLUMN     "deliverer_user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DeliveryTimetable" DROP CONSTRAINT "DeliveryTimetable_pkey",
DROP COLUMN "deliverer_id",
ADD COLUMN     "deliverer_user_id" INTEGER NOT NULL,
ADD CONSTRAINT "DeliveryTimetable_pkey" PRIMARY KEY ("deliverer_user_id", "day_of_work");

-- AlterTable
ALTER TABLE "Mart" DROP CONSTRAINT "Mart_pkey",
DROP COLUMN "customer_id",
ADD COLUMN     "customer_user_id" INTEGER NOT NULL,
ADD CONSTRAINT "Mart_pkey" PRIMARY KEY ("customer_user_id", "product_id", "type");

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "user_email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "receipts" DROP COLUMN "customer_id",
DROP COLUMN "teller_id",
ADD COLUMN     "customer_user_id" INTEGER NOT NULL,
ADD COLUMN     "teller_user_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Teller";

-- DropTable
DROP TABLE "Workers";

-- DropTable
DROP TABLE "address";

-- DropTable
DROP TABLE "customers";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "googleId" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "role" "UserRole" NOT NULL,
    "date_of_birth" DATE,
    "hire_date" DATE,
    "id_number" TEXT,
    "profile_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "address_line" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "postal_code" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_id_number_key" ON "profiles"("id_number");

-- CreateIndex
CREATE INDEX "profiles_user_id_idx" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "profiles_role_idx" ON "profiles"("role");

-- CreateIndex
CREATE INDEX "addresses_profile_id_idx" ON "addresses"("profile_id");

-- CreateIndex
CREATE INDEX "Delivery_deliverer_user_id_idx" ON "Delivery"("deliverer_user_id");

-- CreateIndex
CREATE INDEX "Delivery_customer_user_id_idx" ON "Delivery"("customer_user_id");

-- CreateIndex
CREATE INDEX "DeliveryTimetable_deliverer_user_id_idx" ON "DeliveryTimetable"("deliverer_user_id");

-- CreateIndex
CREATE INDEX "Mart_customer_user_id_idx" ON "Mart"("customer_user_id");

-- CreateIndex
CREATE INDEX "Session_user_email_idx" ON "Session"("user_email");

-- CreateIndex
CREATE INDEX "receipts_customer_user_id_idx" ON "receipts"("customer_user_id");

-- CreateIndex
CREATE INDEX "receipts_teller_user_id_idx" ON "receipts"("teller_user_id");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mart" ADD CONSTRAINT "Mart_customer_user_id_fkey" FOREIGN KEY ("customer_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_customer_user_id_fkey" FOREIGN KEY ("customer_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_teller_user_id_fkey" FOREIGN KEY ("teller_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_customer_user_id_fkey" FOREIGN KEY ("customer_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_deliverer_user_id_fkey" FOREIGN KEY ("deliverer_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryTimetable" ADD CONSTRAINT "DeliveryTimetable_deliverer_user_id_fkey" FOREIGN KEY ("deliverer_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
