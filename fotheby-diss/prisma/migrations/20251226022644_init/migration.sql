-- CreateTable
CREATE TABLE "Auction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "auctionDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Lot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lotNumber" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "yearProduced" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedPrice" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "auctionId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lot_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LotImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lotNumber" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LotImage_lotNumber_fkey" FOREIGN KEY ("lotNumber") REFERENCES "Lot" ("lotNumber") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaintingDetails" (
    "lotNumber" TEXT NOT NULL PRIMARY KEY,
    "medium" TEXT NOT NULL,
    "framed" BOOLEAN NOT NULL,
    "heightCm" DECIMAL NOT NULL,
    "lengthCm" DECIMAL NOT NULL,
    CONSTRAINT "PaintingDetails_lotNumber_fkey" FOREIGN KEY ("lotNumber") REFERENCES "Lot" ("lotNumber") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DrawingDetails" (
    "lotNumber" TEXT NOT NULL PRIMARY KEY,
    "medium" TEXT NOT NULL,
    "framed" BOOLEAN NOT NULL,
    "heightCm" DECIMAL NOT NULL,
    "lengthCm" DECIMAL NOT NULL,
    CONSTRAINT "DrawingDetails_lotNumber_fkey" FOREIGN KEY ("lotNumber") REFERENCES "Lot" ("lotNumber") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PhotographDetails" (
    "lotNumber" TEXT NOT NULL PRIMARY KEY,
    "imageType" TEXT NOT NULL,
    "heightCm" DECIMAL NOT NULL,
    "lengthCm" DECIMAL NOT NULL,
    CONSTRAINT "PhotographDetails_lotNumber_fkey" FOREIGN KEY ("lotNumber") REFERENCES "Lot" ("lotNumber") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SculptureDetails" (
    "lotNumber" TEXT NOT NULL PRIMARY KEY,
    "material" TEXT NOT NULL,
    "heightCm" DECIMAL NOT NULL,
    "lengthCm" DECIMAL NOT NULL,
    "widthCm" DECIMAL NOT NULL,
    "weightKg" DECIMAL NOT NULL,
    CONSTRAINT "SculptureDetails_lotNumber_fkey" FOREIGN KEY ("lotNumber") REFERENCES "Lot" ("lotNumber") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CarvingDetails" (
    "lotNumber" TEXT NOT NULL PRIMARY KEY,
    "material" TEXT NOT NULL,
    "heightCm" DECIMAL NOT NULL,
    "lengthCm" DECIMAL NOT NULL,
    "widthCm" DECIMAL NOT NULL,
    "weightKg" DECIMAL NOT NULL,
    CONSTRAINT "CarvingDetails_lotNumber_fkey" FOREIGN KEY ("lotNumber") REFERENCES "Lot" ("lotNumber") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Lot_lotNumber_key" ON "Lot"("lotNumber");

-- CreateIndex
CREATE INDEX "LotImage_lotNumber_idx" ON "LotImage"("lotNumber");
