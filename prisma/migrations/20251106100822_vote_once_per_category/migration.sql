/*
  Warnings:

  - A unique constraint covering the columns `[userId,category]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Vote` ADD COLUMN `category` ENUM('PLUS35', 'PLUS50', 'PLUS60', 'ONLINE') NOT NULL DEFAULT 'PLUS35';

-- CreateIndex
CREATE UNIQUE INDEX `Vote_userId_category_key` ON `Vote`(`userId`, `category`);
