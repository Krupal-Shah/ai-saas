-- CreateTable
CREATE TABLE "UserApiLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserApiLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "stripe_current_period_end" TIMESTAMP(3),

    CONSTRAINT "userSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserApiLimit_userId_key" ON "UserApiLimit"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "userSubscription_userId_key" ON "userSubscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "userSubscription_stripe_customer_id_key" ON "userSubscription"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "userSubscription_stripe_subscription_id_key" ON "userSubscription"("stripe_subscription_id");
