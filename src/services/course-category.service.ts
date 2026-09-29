import {prisma} from '../lib/prisma';

const createCourseCategory = async (data: any): Promise<any> => {
    const { title, description, slug, metaTitle, metaDescription, metaKeywords } = data;

    if (!title || !slug) {
        throw new Error('Title and slug are required fields.');
    }

    const newCategory = await prisma.courseCategory.create({
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

const getCourseCategoryById = async (id: number): Promise<any> => {
    const category = await prisma.courseCategory.findUnique({
        where: { id },
    });
    return category;
}

const getAllCourseCategories = async (filters: any): Promise<any[]> => {
    const { isPublic, page = 1, limit = 10 } = filters;
    if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers.');
    }
    if (limit > 50) {
        throw new Error('Limit cannot exceed 50.');
    }
    const skip = (page - 1) * limit;
    const categories = await prisma.courseCategory.findMany({
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

const updateCourseCategory = async (id: number, updateData: any): Promise<any> => {
    const allowedFields = ['title', 'description', 'slug', 'metaTitle', 'metaDescription', 'metaKeywords', 'isPublic'];
    const dataToUpdate: any = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            dataToUpdate[field] = updateData[field];
        }
    }
    const updatedCategory = await prisma.courseCategory.update({
        where: { id },
        data: dataToUpdate,
    });
    return updatedCategory;
}

const deleteCourseCategory = async (id: number): Promise<any> => {
    const deletedCategory = await prisma.courseCategory.delete({
        where: { id },
    });
    return deletedCategory;
}

export {
    createCourseCategory,
    getCourseCategoryById,
    getAllCourseCategories,
    updateCourseCategory,
    deleteCourseCategory,
};