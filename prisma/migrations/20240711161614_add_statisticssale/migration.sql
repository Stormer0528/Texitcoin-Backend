-- CreateTable
CREATE TABLE "statistics_sale" (
    "id" TEXT NOT NULL,
    "statisticsId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "statistics_sale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "index_statisticssale_on_statisticsId" ON "statistics_sale"("statisticsId");

-- CreateIndex
CREATE INDEX "index_statisticssale_on_saleId" ON "statistics_sale"("saleId");

-- CreateIndex
CREATE INDEX "index_memberStatistics_on_statisticsId" ON "member_statistics"("statisticsId");

-- AddForeignKey
ALTER TABLE "statistics_sale" ADD CONSTRAINT "statistics_sale_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "statistics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "statistics_sale" ADD CONSTRAINT "statistics_sale_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
