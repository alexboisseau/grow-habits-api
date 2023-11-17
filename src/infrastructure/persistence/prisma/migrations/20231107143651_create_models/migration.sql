-- CreateEnum
CREATE TYPE "TrackedHabitStatus" AS ENUM ('TO_COMPLETE', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cue" TEXT NOT NULL,
    "craving" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "reward" TEXT NOT NULL,
    "trackedFrom" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TrackedHabit" (
    "id" TEXT NOT NULL,
    "status" "TrackedHabitStatus" NOT NULL,
    "date" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Habit_id_key" ON "Habit"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedHabit_id_key" ON "TrackedHabit"("id");

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedHabit" ADD CONSTRAINT "TrackedHabit_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedHabit" ADD CONSTRAINT "TrackedHabit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
