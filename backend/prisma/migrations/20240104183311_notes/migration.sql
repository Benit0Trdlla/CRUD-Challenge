/*
  Warnings:

  - You are about to alter the column `name` on the `notes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `notes` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `content` TEXT NOT NULL;
