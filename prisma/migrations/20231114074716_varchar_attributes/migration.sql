/*
  Warnings:

  - You are about to alter the column `name` on the `Habit` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `cue` on the `Habit` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `craving` on the `Habit` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `response` on the `Habit` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `reward` on the `Habit` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Habit" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "cue" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "craving" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "response" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "reward" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);
