/*
  Warnings:

  - You are about to drop the `block` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "block";

-- CreateTable
CREATE TABLE "blocks" (
    "id" TEXT NOT NULL,
    "blockNo" INTEGER NOT NULL,
    "hashRate" DOUBLE PRECISION NOT NULL,
    "difficulty" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "index_blocks_on_block_number" ON "blocks"("blockNo");
