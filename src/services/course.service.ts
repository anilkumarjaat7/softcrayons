import { prisma } from '../lib/prisma';
import { CourseDifficulty } from '../../generated/prisma/client';
const createCourse = async (data: any): Promise<any> => {
    const { title, description, categoryId, slug, about, fees, discount, duration, difficulty, topics, bannerImage, thumbnailImage, metaTitle, metaDescription, metaKeywords } = data;

    if (!title || !categoryId || !slug || !difficulty) {
        throw new Error('Title, category, slug, and difficulty are required fields.');
    }

    const newCourse = await prisma.course.create({
        data: {
            title,
            description,
            categoryId,
            slug,
            about,
            fees,
            discount,
            duration,
            difficulty,
            topics,
            bannerImage,
            thumbnailImage,
            metaTitle,
            metaDescription,
            metaKeywords,
        },
    });

    return newCourse;
}

const getCourseById = async (id: number): Promise<any> => {
    const course = await prisma.course.findUnique({
        where: { id },
    });
    return course;
}

const getAllCourses = async (filters: any): Promise<any[]> => {
    const { categoryId, isPublic, isFeatured, page = 1, limit = 10 } = filters;
    if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers.');
    }
    if (limit > 50) {
        throw new Error('Limit cannot exceed 50.');
    }
    const skip = (page - 1) * limit;
    const courses = await prisma.course.findMany({
        where: {
            ...(categoryId && { categoryId }),
            ...(isPublic !== undefined && { isPublic }),
            ...(isFeatured !== undefined && { isFeatured }),
        },
        orderBy: {
            title: 'asc',
        },
        skip,
        take: limit,
    });
    return courses;
}

const updateCourse = async (id: number, updateData: any): Promise<any> => {
    const allowedFields = ['title', 'description', 'categoryId', 'slug', 'about', 'fees', 'discount', 'duration', 'difficulty', 'topics', 'bannerImage', 'thumbnailImage', 'metaTitle', 'metaDescription', 'metaKeywords', 'isPublic', 'isFeatured'];
    const dataToUpdate: any = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            dataToUpdate[field] = updateData[field];
        }
    }
    const updatedCourse = await prisma.course.update({
        where: { id },
        data: dataToUpdate,
    });
    return updatedCourse;
}

const deleteCourse = async (id: number): Promise<any> => {
    const deletedCourse = await prisma.course.delete({
        where: { id },
    });
    return deletedCourse;
}

export {
    createCourse,
    getCourseById,
    getAllCourses,
    updateCourse,
    deleteCourse,
};