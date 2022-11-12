/*
  Warnings:

  - You are about to drop the column `product_id` on the `Product` table. All the data in the column will be lost.
  - Added the required column `product_api` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "product_id",
ADD COLUMN     "product_api" TEXT NOT NULL;
