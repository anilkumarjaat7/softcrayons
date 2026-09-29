import { prisma } from '../lib/prisma';

export const createTutorialsLesson = async (data: any): Promise<any> => {
    const { title, slug, content, subtopicId, position } = data;

    if (!title || !slug || !content || !subtopicId || position === undefined) {
        throw new Error('Title, slug, content, subtopicId, and position are required fields.');
    }

    return await prisma.tutorialsLesson.create({
        data,
    });
}

export const getTutorialsLessonById = async (id: number): Promise<any> => {
    return await prisma.tutorialsLesson.findUnique({
        where: { id },
    });
}

export const getAllTutorialsLessons = async (filters: any): Promise<any> => {
    const { isPublic, subtopicId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const whereClause: any = {
        ...(isPublic !== undefined && { isPublic: isPublic === 'true' || isPublic === true }),
        ...(subtopicId && { subtopicId: parseInt(subtopicId) }),
    };

    const totalCount = await prisma.tutorialsLesson.count({ where: whereClause });

    const lessons = await prisma.tutorialsLesson.findMany({
        where: whereClause,
        orderBy: [{ subtopicId: 'asc' }, { position: 'asc' }],
        skip,
        take: limit,
        select: {
            id: true,
            title: true,
            slug: true,
            position: true,
            isPublic: true,
            isFeatured: true,
            subtopicId: true,
            createdAt: true,
            updatedAt: true,
            subtopic: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    topicId: true,
                    topic: {
                        select: {
                            id: true,
                            title: true,
                            category: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                }
            }
        }
    });

    return {
        lessons,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
    };
}

export const getTutorialsLessonContent = async (id: number): Promise<any> => {
    return await prisma.tutorialsLesson.findUnique({
        where: { id },
        select: {
            id: true,
            content: true,
            tableOfContent: true,
        }
    });
}

export const updateTutorialsLesson = async (id: number, updateData: any): Promise<any> => {
    return await prisma.tutorialsLesson.update({
        where: { id },
        data: updateData,
    });
}

export const deleteTutorialsLesson = async (id: number): Promise<any> => {
    return await prisma.tutorialsLesson.delete({
        where: { id },
    });
}
