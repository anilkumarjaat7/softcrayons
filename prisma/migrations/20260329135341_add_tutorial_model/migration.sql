-- CreateTable
CREATE TABLE "TutorialsCategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "logo" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorialsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialsTopic" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "logo" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorialsTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialsSubTopic" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "topicId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "logo" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorialsSubTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialsLesson" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "tableOfContent" JSONB,
    "nextLink" TEXT,
    "previousLink" TEXT,
    "homeLink" TEXT,
    "subtopicId" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "logo" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorialsLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TutorialsCategory_slug_key" ON "TutorialsCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialsCategory_position_key" ON "TutorialsCategory"("position");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialsTopic_slug_key" ON "TutorialsTopic"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialsTopic_categoryId_position_key" ON "TutorialsTopic"("categoryId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialsSubTopic_slug_key" ON "TutorialsSubTopic"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialsSubTopic_topicId_position_key" ON "TutorialsSubTopic"("topicId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialsLesson_slug_key" ON "TutorialsLesson"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialsLesson_subtopicId_position_key" ON "TutorialsLesson"("subtopicId", "position");

-- AddForeignKey
ALTER TABLE "TutorialsTopic" ADD CONSTRAINT "TutorialsTopic_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TutorialsCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialsSubTopic" ADD CONSTRAINT "TutorialsSubTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "TutorialsTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialsLesson" ADD CONSTRAINT "TutorialsLesson_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "TutorialsSubTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
