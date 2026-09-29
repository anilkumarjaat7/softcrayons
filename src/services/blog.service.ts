import {prisma} from '../lib/prisma';

interface createBlogData {
    title: string;
    description?: string;
    content: string;
    categoryId: number;
    slug: string;
    authorId: string;
    bannerImage?: string;
    thumbnailImage?: string;
    dateOfPublish: Date;
    readTime: number;
    tags?: string[];
    tableOfContents?: string[];
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
}

const createBlog = async (data: createBlogData): Promise<any> => {
    const { title, description, content, categoryId, slug, authorId, bannerImage, thumbnailImage, dateOfPublish, readTime, tags, tableOfContents, metaTitle, metaDescription, metaKeywords } = data;

    if (!title || !categoryId || !slug || !authorId || !dateOfPublish || !readTime || !content) {
        throw new Error('Title, category, slug, and author are required fields.');
    }

    const publishDate = typeof dateOfPublish === 'string' ? new Date(dateOfPublish) : dateOfPublish;

    const newBlog = await prisma.blog.create({
        data: {
            title,
            description,
            content,
            categoryId,
            slug,
            authorId,
            bannerImage,
            thumbnailImage,
            dateOfPublish: publishDate,
            readTime,
            tags,
            tableOfContents,
            metaTitle,
            metaDescription,
            metaKeywords,
        },
    });

    return newBlog;
}

const getBlogById = async (id: number): Promise<any> => {
    const blog = await prisma.blog.findUnique({
        where: { id },
    });
    return blog;
}

const getAllBlogs = async (filters: any): Promise<any[]> => {
    const { categoryId, authorId, isPublic, isFeatured, page = 1, limit = 10 } = filters;
    if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers.');
    }
    if (limit > 50) {
        throw new Error('Limit cannot exceed 50.');
    }
    const skip = (page - 1) * limit;
    const blogs = await prisma.blog.findMany({
        where: {
            ...(categoryId && { categoryId }),
            ...(authorId && { authorId }),
            ...(isPublic !== undefined && { isPublic }),
            ...(isFeatured !== undefined && { isFeatured }),
        },
        orderBy: {
            dateOfPublish: 'desc',
        },
        skip,
        take: limit,
    });
    return blogs;
}

const updateBlog = async (id: number, updateData: any): Promise<any> => {
    const allowedFields = ['title', 'description', 'content', 'categoryId', 'slug', 'authorId', 'bannerImage', 'thumbnailImage', 'dateOfPublish', 'readTime', 'tags', 'tableOfContents', 'metaTitle', 'metaDescription', 'metaKeywords', 'isPublic', 'isFeatured'];
    const dataToUpdate: any = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            if (field === 'dateOfPublish' && typeof updateData[field] === 'string') {
                dataToUpdate[field] = new Date(updateData[field]);
            } else {
                dataToUpdate[field] = updateData[field];
            }
        }
    }
    const updatedBlog = await prisma.blog.update({
        where: { id },
        data: dataToUpdate,
    });
    return updatedBlog;
}

const deleteBlog = async (id: number): Promise<any> => {
    const deletedBlog = await prisma.blog.delete({
        where: { id },
    });
    return deletedBlog;
}

export {
    createBlog,
    getBlogById,
    getAllBlogs,
    updateBlog,
    deleteBlog,
};