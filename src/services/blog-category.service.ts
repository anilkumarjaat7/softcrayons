import { prisma } from '../lib/prisma';

const createBlogCategory = async (data: any): Promise<any> => {
    const { title, description, slug, metaTitle, metaDescription, metaKeywords } = data;

    if (!title || !slug) {
        throw new Error('Title and slug are required fields.');
    }

    const newCategory = await prisma.blogCategory.create({
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

const getBlogCategoryById = async (id: number): Promise<any> => {
    const category = await prisma.blogCategory.findUnique({
        where: { id },
    });
    return category;
}

const getAllBlogCategories = async (filters: any): Promise<any[]> => {
    const { isPublic, page = 1, limit = 10 } = filters;
    if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers.');
    }
    if (limit > 50) {
        throw new Error('Limit cannot exceed 50.');
    }
    const skip = (page - 1) * limit;
    const categories = await prisma.blogCategory.findMany({
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

const updateBlogCategory = async (id: number, updateData: any): Promise<any> => {
    const allowedFields = ['title', 'description', 'slug', 'metaTitle', 'metaDescription', 'metaKeywords', 'isPublic'];
    const dataToUpdate: any = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            dataToUpdate[field] = updateData[field];
        }
    }
    const updatedCategory = await prisma.blogCategory.update({
        where: { id },
        data: dataToUpdate,
    });
    return updatedCategory;
}

const deleteBlogCategory = async (id: number): Promise<any> => {
    const deletedCategory = await prisma.blogCategory.delete({
        where: { id },
    });
    return deletedCategory;
}

export {
    createBlogCategory,
    getBlogCategoryById,
    getAllBlogCategories,
    updateBlogCategory,
    deleteBlogCategory,
};