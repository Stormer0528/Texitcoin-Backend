/*
  Warnings:

  - A unique constraint covering the columns `[memberId,payoutId,address,deletedAt]` on the table `memberwallets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "unique_index_on_memberwallets" ON "memberwallets"("memberId", "payoutId", "address", "deletedAt");
