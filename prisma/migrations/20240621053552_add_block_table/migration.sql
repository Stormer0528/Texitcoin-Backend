-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
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
    "address" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
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
    "difficulty" INTEGER NOT NULL,
    "hashRate" INTEGER NOT NULL,
    "issuedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_statistics" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "txcShared" DOUBLE PRECISION NOT NULL,
    "hashPower" INTEGER NOT NULL,
    "issuedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "block" (
    "id" TEXT NOT NULL,
    "hashRate" DOUBLE PRECISION NOT NULL,
    "difficulty" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "index_users_on_username" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "index_users_on_email" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "index_members_on_username" ON "members"("username");

-- CreateIndex
CREATE INDEX "index_sales_on_username" ON "sales"("username");

-- CreateIndex
CREATE INDEX "index_sales_on_memberId" ON "sales"("memberId");

-- CreateIndex
CREATE INDEX "index_sales_on_statisticsId" ON "sales"("statisticsId");

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "statistics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
