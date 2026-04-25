-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('SAVINGS', 'EMERGENCY_FUNDS', 'LOANS', 'TRAVEL', 'BILLS_PAYMENT');

-- CreateEnum
CREATE TYPE "ContributionFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ONGOING', 'DONE', 'STOPPED');

-- CreateTable
CREATE TABLE "Goal" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "goal_name" TEXT NOT NULL,
    "goal_type" "GoalType" NOT NULL DEFAULT 'SAVINGS',
    "goal_amount" DECIMAL(12,2) NOT NULL,
    "goal_currency" CHAR(3) NOT NULL,
    "target_date" TIMESTAMP(3),
    "contribution_frequency" "ContributionFrequency",
    "goal_status" "GoalStatus" DEFAULT 'ONGOING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
