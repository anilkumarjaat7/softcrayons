import { prisma } from '../lib/prisma';

export const createTutorialsTopic = async (data: any): Promise<any> => {
    const { title, slug, categoryId, position } = data;

    if (!title || !slug || !categoryId || position === undefined) {
        throw new Error('Title, slug, categoryId, and position are required fields.');
    }

    return await prisma.tutorialsTopic.create({
        data,
    });
}

export const getTutorialsTopicById = async (id: number): Promise<any> => {
    return await prisma.tutorialsTopic.findUnique({
        where: { id },
    });
}

export const getAllTutorialsTopics = async (filters: any): Promise<any> => {
    const { isPublic, categoryId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const whereClause: any = {
        ...(isPublic !== undefined && { isPublic: isPublic === 'true' || isPublic === true }),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
    };

    const totalCount = await prisma.tutorialsTopic.count({ where: whereClause });

    const topics = await prisma.tutorialsTopic.findMany({
        where: whereClause,
        orderBy: [{ categoryId: 'asc' }, { position: 'asc' }],
        skip,
        take: limit,
        include: {
            category: {
                select: { id: true, title: true, slug: true }
            }
        }
    });

    return {
        topics,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
    };
}

export const updateTutorialsTopic = async (id: number, updateData: any): Promise<any> => {
    return await prisma.tutorialsTopic.update({
        where: { id },
        data: updateData,
    });
}

export const deleteTutorialsTopic = async (id: number): Promise<any> => {
    return await prisma.tutorialsTopic.delete({
        where: { id },
    });
}
