import { prisma } from '../lib/prisma';

export const createTutorialsSubTopic = async (data: any): Promise<any> => {
    const { title, slug, topicId, position } = data;

    if (!title || !slug || !topicId || position === undefined) {
        throw new Error('Title, slug, topicId, and position are required fields.');
    }

    return await prisma.tutorialsSubTopic.create({
        data,
    });
}

export const getTutorialsSubTopicById = async (id: number): Promise<any> => {
    return await prisma.tutorialsSubTopic.findUnique({
        where: { id },
        include: {
            topic: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    categoryId: true,
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
    });
}

export const getAllTutorialsSubTopics = async (filters: any): Promise<any> => {
    const { isPublic, topicId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const whereClause: any = {
        ...(isPublic !== undefined && { isPublic: isPublic === 'true' || isPublic === true }),
        ...(topicId && { topicId: parseInt(topicId) }),
    };

    const totalCount = await prisma.tutorialsSubTopic.count({ where: whereClause });

    const subTopics = await prisma.tutorialsSubTopic.findMany({
        where: whereClause,
        orderBy: [{ topicId: 'asc' }, { position: 'asc' }],
        skip,
        take: limit,
        include: {
            topic: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    categoryId: true,
                    category: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                }
            }
        }
    });

    return {
        subTopics,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
    };
}

export const updateTutorialsSubTopic = async (id: number, updateData: any): Promise<any> => {
    return await prisma.tutorialsSubTopic.update({
        where: { id },
        data: updateData,
    });
}

export const deleteTutorialsSubTopic = async (id: number): Promise<any> => {
    return await prisma.tutorialsSubTopic.delete({
        where: { id },
    });
}
