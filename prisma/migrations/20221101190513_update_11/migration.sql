/*
  Warnings:

  - Added the required column `total_payment` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "total_payment" DOUBLE PRECISION NOT NULL;
