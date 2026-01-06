-- CreateTable
CREATE TABLE "cameras" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "rtsp_url" TEXT NOT NULL,
    "path_name" TEXT NOT NULL,
    "ffmpeg_pid" INTEGER,
    "last_accessed" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cameras_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cameras_rtsp_url_key" ON "cameras"("rtsp_url");

-- CreateIndex
CREATE UNIQUE INDEX "cameras_path_name_key" ON "cameras"("path_name");
