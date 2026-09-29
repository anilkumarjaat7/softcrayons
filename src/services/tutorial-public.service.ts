import { prisma } from "@/lib/prisma";

type PositionItem = { position?: number | null };

function sortByPosition<T extends PositionItem>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

export async function getPublicTutorialLanding() {
  const [categories, topics] = await Promise.all([
    prisma.tutorialsCategory.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        position: true,
      },
    }),
    prisma.tutorialsTopic.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        position: true,
        categoryId: true,
        subtopics: {
          where: { isPublic: true },
          select: {
            position: true,
            lessons: {
              where: { isPublic: true },
              select: { slug: true, position: true },
            },
          },
        },
      },
    }),
  ]);

  const sortedTopics = sortByPosition(topics).map((topic) => {
    const sortedSubtopics = sortByPosition(topic.subtopics).map((subtopic) => ({
      ...subtopic,
      lessons: sortByPosition(subtopic.lessons),
    }));

    const firstLessonSlug =
      sortedSubtopics.find((subtopic) => subtopic.lessons.length > 0)?.lessons[0]?.slug ?? undefined;

    return {
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      position: topic.position,
      categoryId: topic.categoryId,
      firstLessonSlug,
    };
  });

  return sortByPosition(categories).map((category) => ({
    id: category.id,
    title: category.title,
    slug: category.slug,
    description: category.description,
    position: category.position,
    topics: sortedTopics
      .filter((topic) => topic.categoryId === category.id)
      .map(({ categoryId, ...topic }) => topic),
  }));
}

export async function getPublicTutorialNavbarTopics(limit = 4) {
  const featured = await prisma.tutorialsTopic.findMany({
    where: { isPublic: true, isFeatured: true },
    select: { title: true, slug: true, position: true },
  });

  const sortedFeatured = sortByPosition(featured).slice(0, limit);

  if (sortedFeatured.length >= limit) {
    return sortedFeatured.map(({ title, slug }) => ({ title, slug }));
  }

  const fallback = await prisma.tutorialsTopic.findMany({
    where: {
      isPublic: true,
      slug: { notIn: sortedFeatured.map((topic) => topic.slug) },
    },
    select: { title: true, slug: true, position: true },
  });

  const sortedFallback = sortByPosition(fallback).slice(0, limit - sortedFeatured.length);

  return [...sortedFeatured, ...sortedFallback].map(({ title, slug }) => ({ title, slug }));
}

export async function getPublicTutorialTopicBySlug(slug: string) {
  const topic = await prisma.tutorialsTopic.findFirst({
    where: { slug, isPublic: true },
    include: {
      category: {
        select: { id: true, title: true, slug: true },
      },
      subtopics: {
        where: { isPublic: true },
        include: {
          lessons: {
            where: { isPublic: true },
            select: {
              id: true,
              title: true,
              slug: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!topic) return null;

  return {
    ...topic,
    subtopics: sortByPosition(topic.subtopics).map((subtopic) => ({
      ...subtopic,
      lessons: sortByPosition(subtopic.lessons),
    })),
  };
}

export async function getPublicTutorialLessonBySlug(slug: string) {
  const lesson = await prisma.tutorialsLesson.findFirst({
    where: { slug, isPublic: true },
    include: {
      subtopic: {
        select: {
          id: true,
          title: true,
          slug: true,
          topic: {
            select: {
              id: true,
              title: true,
              slug: true,
              category: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!lesson) return null;

  return lesson;
}

export async function getPublicTutorialSearch(query: string, limit: number) {
  const [topics, lessons] = await Promise.all([
    prisma.tutorialsTopic.findMany({
      where: {
        isPublic: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        position: true,
        category: { select: { title: true, slug: true } },
      },
      take: limit,
    }),
    prisma.tutorialsLesson.findMany({
      where: {
        isPublic: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        position: true,
        subtopic: {
          select: {
            title: true,
            slug: true,
            topic: { select: { title: true, slug: true } },
          },
        },
      },
      take: limit,
    }),
  ]);

  return {
    topics: sortByPosition(topics).map(({ position, ...topic }) => topic),
    lessons: sortByPosition(lessons).map(({ position, ...lesson }) => lesson),
  };
}
