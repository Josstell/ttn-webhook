-- CreateTable
CREATE TABLE "Uplink" (
    "id" TEXT NOT NULL,
    "application" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "devEui" TEXT NOT NULL,
    "devAddr" TEXT NOT NULL,
    "fPort" INTEGER NOT NULL,
    "fCnt" INTEGER NOT NULL,
    "battery" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "rssi" INTEGER,
    "snr" DOUBLE PRECISION,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raw" JSONB NOT NULL,

    CONSTRAINT "Uplink_pkey" PRIMARY KEY ("id")
);
