/*
  Warnings:

  - Added the required column `username` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "index_sales_on_username" ON "sales"("username");
