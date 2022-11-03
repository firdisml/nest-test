/*
  Warnings:

  - Added the required column `product` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "product" TEXT NOT NULL,
ADD COLUMN     "value" INTEGER NOT NULL;
