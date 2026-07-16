/*
  Warnings:

  - The values [BENEFICIARY] on the enum `AgentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `beneficiaryId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `Beneficiary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `receiverAccountNumber` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverBankName` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverIFSC` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverName` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AgentType_new" AS ENUM ('BALANCE', 'NETWORK', 'COMPLIANCE', 'DUPLICATE', 'EVIDENCE', 'DECISION', 'EXECUTION');
ALTER TABLE "AgentRun" ALTER COLUMN "agentName" TYPE "AgentType_new" USING ("agentName"::text::"AgentType_new");
ALTER TYPE "AgentType" RENAME TO "AgentType_old";
ALTER TYPE "AgentType_new" RENAME TO "AgentType";
DROP TYPE "public"."AgentType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Beneficiary" DROP CONSTRAINT "Beneficiary_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_beneficiaryId_fkey";

-- DropIndex
DROP INDEX "Payment_beneficiaryId_idx";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "beneficiaryId",
DROP COLUMN "processedAt",
ADD COLUMN     "receiverAccountNumber" TEXT NOT NULL,
ADD COLUMN     "receiverBankName" TEXT NOT NULL,
ADD COLUMN     "receiverIFSC" TEXT NOT NULL,
ADD COLUMN     "receiverName" TEXT NOT NULL,
ADD COLUMN     "requiresInvestigation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Beneficiary";

-- DropEnum
DROP TYPE "BeneficiaryStatus";
