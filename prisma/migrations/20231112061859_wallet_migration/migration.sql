/*
  Warnings:

  - Added the required column `lastActive` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastActive" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Wallet" (
    "address" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("address")
);

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
