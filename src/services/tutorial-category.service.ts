import { prisma } from '../lib/prisma';

export const createTutorialsCategory = async (data: any): Promise<any> => {
    const { title, description, slug, position, isPublic, isFeatured, logo, metaTitle, metaDescription, metaKeywords } = data;

    if (!title || !slug || position === undefined) {
        throw new Error('Title, slug, and position are required fields.');
    }

    return await prisma.tutorialsCategory.create({
        data,
    });
}

export const getTutorialsCategoryById = async (id: number): Promise<any> => {
    return await prisma.tutorialsCategory.findUnique({
        where: { id },
    });
}

export const getAllTutorialsCategories = async (filters: any): Promise<any> => {
    const { isPublic, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const whereClause: any = {
        ...(isPublic !== undefined && { isPublic: isPublic === 'true' || isPublic === true }),
    };

    const totalCount = await prisma.tutorialsCategory.count({ where: whereClause });

    const categories = await prisma.tutorialsCategory.findMany({
        where: whereClause,
        orderBy: { position: 'asc' },
        skip,
        take: limit,
    });

    return {
        categories,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
    };
}

export const updateTutorialsCategory = async (id: number, updateData: any): Promise<any> => {
    return await prisma.tutorialsCategory.update({
        where: { id },
        data: updateData,
    });
}

export const deleteTutorialsCategory = async (id: number): Promise<any> => {
    return await prisma.tutorialsCategory.delete({
        where: { id },
    });
}
