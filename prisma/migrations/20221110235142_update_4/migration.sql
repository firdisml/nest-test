/*
  Warnings:

  - You are about to drop the column `total_payment` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `credit` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "total_payment",
DROP COLUMN "value",
ADD COLUMN     "credit" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
