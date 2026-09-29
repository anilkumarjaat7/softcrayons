import {prisma} from '../lib/prisma';

const createFaq = async (data: any): Promise<any> => {
    const { question, answer, slug, categoryId, metaTitle, metaDescription, metaKeywords } = data;

    if (!question || !answer || !categoryId) {
        throw new Error('Question, answer, and categoryId are required fields.');
    }
    const newFaq = await prisma.faq.create({
        data: {
            question,
            answer,
            slug,
            categoryId,
            metaTitle,
            metaDescription,
            metaKeywords,
        },
    });

    return newFaq;
}

const getFaqById = async (id: number): Promise<any> => {
    const faq = await prisma.faq.findUnique({
        where: { id },
    });
    return faq;
}

const getAllFaqs = async (filters: any): Promise<any[]> => {
    const { categoryId, isPublic, page = 1, limit = 10 } = filters;
    if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers.');
    }
    if (limit > 50) {
        throw new Error('Limit cannot exceed 50.');
    }
    const skip = (page - 1) * limit;
    const faqs = await prisma.faq.findMany({
        where: {
            ...(categoryId && { categoryId }),
            ...(isPublic !== undefined && { isPublic }),
        },
        orderBy: {
            question: 'asc',
        },
        skip,
        take: limit,
    });
    return faqs;
}

const updateFaq = async (id: number, updateData: any): Promise<any> => {
    const allowedFields = ['question', 'answer', 'slug', 'categoryId', 'isPublic', 'isFeatured', 'metaTitle', 'metaDescription', 'metaKeywords'];
    const dataToUpdate: any = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            dataToUpdate[field] = updateData[field];
        }
    }
    const updatedFaq = await prisma.faq.update({
        where: { id },
        data: dataToUpdate,
    });
    return updatedFaq;
}

const deleteFaq = async (id: number): Promise<any> => {
    const deletedFaq = await prisma.faq.delete({
        where: { id },
    });
    return deletedFaq;
}

export {
    createFaq,
    getFaqById,
    getAllFaqs,
    updateFaq,
    deleteFaq,
};