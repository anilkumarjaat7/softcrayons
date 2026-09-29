import {prisma} from '../lib/prisma';

const createFaqCategory = async (data: any): Promise<any> => {
    const { title, description, slug, metaTitle, metaDescription, metaKeywords } = data;

    if (!title || !slug) {
        throw new Error('Title and slug are required fields.');
    }

    const newCategory = await prisma.faqCategory.create({
        data: {
            title,
            description,
            slug,
            metaTitle,
            metaDescription,
            metaKeywords,
        },
    });

    return newCategory;
}

const getFaqCategoryById = async (id: number): Promise<any> => {
    const category = await prisma.faqCategory.findUnique({
        where: { id },
    });
    return category;
}

const getAllFaqCategories = async (filters: any): Promise<any[]> => {
    const { isPublic, page = 1, limit = 10 } = filters;
    if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers.');
    }
    if (limit > 50) {
        throw new Error('Limit cannot exceed 50.');
    }
    const skip = (page - 1) * limit;
    const categories = await prisma.faqCategory.findMany({
        where: {
            ...(isPublic !== undefined && { isPublic }),
        },
        orderBy: {
            title: 'asc',
        },
        skip,
        take: limit,
    });
    return categories;
}

const updateFaqCategory = async (id: number, updateData: any): Promise<any> => {
    const allowedFields = ['title', 'description', 'slug', 'metaTitle', 'metaDescription', 'metaKeywords', 'isPublic'];
    const dataToUpdate: any = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            dataToUpdate[field] = updateData[field];
        }
    }
    const updatedCategory = await prisma.faqCategory.update({
        where: { id },
        data: dataToUpdate,
    });
    return updatedCategory;
}

const deleteFaqCategory = async (id: number): Promise<any> => {
    const deletedCategory = await prisma.faqCategory.delete({
        where: { id },
    });
    return deletedCategory;
}

export {
    createFaqCategory,
    getFaqCategoryById,
    getAllFaqCategories,
    updateFaqCategory,
    deleteFaqCategory,
};