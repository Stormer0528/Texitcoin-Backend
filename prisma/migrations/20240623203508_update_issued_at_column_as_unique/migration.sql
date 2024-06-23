/*
  Warnings:

  - A unique constraint covering the columns `[issuedAt]` on the table `statistics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "index_statistics_on_issuedAt" ON "statistics"("issuedAt");
