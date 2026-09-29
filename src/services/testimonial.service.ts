import {prisma} from '../lib/prisma';

const createTestimonial = async (data: any): Promise<any> => {
    const { studentName,  avatar, rating, feedback } = data;
    if (!studentName || !feedback || !rating) {
        throw new Error('Student name, feedback, and rating are required fields.');
    }
    const newTestimonial = await prisma.testimonial.create({
        data: {
            studentName,
            avatar,
            rating,
            feedback,
        },
    });
    return newTestimonial;
}

const getTestimonialById = async (id: number): Promise<any> => {
    const testimonial = await prisma.testimonial.findUnique({
        where: { id },
    });
    return testimonial;
}

const getAllTestimonials = async (filters: any): Promise<any[]> => {
    const {isPublic, page = 1, limit = 10 } = filters;
    if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers.');
    }
    if (limit > 50) {
        throw new Error('Limit cannot exceed 50.');
    }
    const skip = (page - 1) * limit;
    const testimonials = await prisma.testimonial.findMany({
        where: {
            ...(isPublic !== undefined && { isPublic }),
        },
        orderBy: {
            studentName: 'asc',
        },
        skip,
        take: limit,
    });
    return testimonials;
}

const updateTestimonial = async (id: number, updateData: any): Promise<any> => {
    const allowedFields = ['studentName', 'avatar', 'rating', 'feedback', 'isPublic', 'isFeatured'];
    const dataToUpdate: any = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            dataToUpdate[field] = updateData[field];
        }
    }
    const updatedTestimonial = await prisma.testimonial.update({
        where: { id },
        data: dataToUpdate,
    });
    return updatedTestimonial;
}

const deleteTestimonial = async (id: number): Promise<any> => {
    const deletedTestimonial = await prisma.testimonial.delete({
        where: { id },
    });
    return deletedTestimonial;
}

export {
    createTestimonial,
    getTestimonialById,
    getAllTestimonials,
    updateTestimonial,
    deleteTestimonial,
};