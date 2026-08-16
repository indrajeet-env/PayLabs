-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "kycVerified" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "ackReceived" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "amlFlag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bankResponseCode" TEXT,
ADD COLUMN     "gatewayResponseCode" TEXT,
ADD COLUMN     "networkLatency" INTEGER NOT NULL DEFAULT 150,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sanctionsMatched" BOOLEAN NOT NULL DEFAULT false;
