-- AlterTable
ALTER TABLE `Girl` ADD COLUMN `category` ENUM('PLUS35', 'PLUS50', 'PLUS60', 'ONLINE') NOT NULL DEFAULT 'PLUS35';

-- CreateTable
CREATE TABLE `CategoryWinner` (
    `category` ENUM('PLUS35', 'PLUS50', 'PLUS60', 'ONLINE') NOT NULL,
    `girlId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CategoryWinner_girlId_key`(`girlId`),
    PRIMARY KEY (`category`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Girl_category_idx` ON `Girl`(`category`);

-- AddForeignKey
ALTER TABLE `CategoryWinner` ADD CONSTRAINT `CategoryWinner_girlId_fkey` FOREIGN KEY (`girlId`) REFERENCES `Girl`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
