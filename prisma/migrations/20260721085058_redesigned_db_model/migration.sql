/*
  Warnings:

  - You are about to drop the column `kycVerified` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `amlFlag` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `failureReason` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `sanctionsMatched` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "dailyTransferLimit" DECIMAL(18,2) NOT NULL DEFAULT 500000.00,
ADD COLUMN     "minimumReserve" DECIMAL(18,2) NOT NULL DEFAULT 1000.00;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "kycVerified";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amlFlag",
DROP COLUMN "failureReason",
DROP COLUMN "sanctionsMatched",
ADD COLUMN     "amlRiskReasons" JSONB,
ADD COLUMN     "amlRiskScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gatewayLogs" TEXT,
ADD COLUMN     "kycStatus" TEXT NOT NULL DEFAULT 'VERIFIED',
ADD COLUMN     "matchedEntity" TEXT,
ADD COLUMN     "matchedList" TEXT,
ADD COLUMN     "riskEngineResponse" JSONB,
ADD COLUMN     "sanctionsMatches" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "switchLogs" TEXT;

-- DropEnum
DROP TYPE "FailureReason";
