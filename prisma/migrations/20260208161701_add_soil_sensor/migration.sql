-- CreateTable
CREATE TABLE "SoilUplink" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "battery" DOUBLE PRECISION NOT NULL,
    "conductivity" DOUBLE PRECISION NOT NULL,
    "soilTemperature" DOUBLE PRECISION NOT NULL,
    "airTemperature" DOUBLE PRECISION NOT NULL,
    "soilMoisture" DOUBLE PRECISION NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "raw" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoilUplink_pkey" PRIMARY KEY ("id")
);
