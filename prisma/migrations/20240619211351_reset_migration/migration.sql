-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR NOT NULL,
    "fullname" VARCHAR NOT NULL,
    "sponsorName" VARCHAR,
    "introducerFullName" VARCHAR,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "mobile" VARCHAR NOT NULL,
    "assetId" VARCHAR NOT NULL,
    "txcPayout" VARCHAR NOT NULL,
    "txcCold" VARCHAR NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "address" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "statisticsId" TEXT NOT NULL,
    "invoiceNo" INTEGER NOT NULL DEFAULT 0,
    "productName" VARCHAR NOT NULL,
    "paymentMethod" VARCHAR NOT NULL,
    "amount" INTEGER NOT NULL,
    "hashPower" INTEGER NOT NULL,
    "issuedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistics" (
    "id" TEXT NOT NULL,
    "newBlocks" INTEGER NOT NULL,
    "totalBlocks" INTEGER NOT NULL,
    "newHashPower" INTEGER NOT NULL,
    "totalHashPower" INTEGER NOT NULL,
    "members" INTEGER,
    "issuedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_statistics" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "txcShared" DOUBLE PRECISION NOT NULL,
    "hashPower" INTEGER NOT NULL,
    "issuedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "index_users_on_username" ON "users"("username");

-- CreateIndex
CREATE INDEX "index_sales_on_username" ON "sales"("username");

-- CreateIndex
CREATE INDEX "index_sales_on_userId" ON "sales"("userId");

-- CreateIndex
CREATE INDEX "index_sales_on_statisticsId" ON "sales"("statisticsId");

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "statistics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
