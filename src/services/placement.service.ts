import {prisma} from '../lib/prisma';

const createPlacement = async (data: any): Promise<any> => {
    const { studentName, courseName, avatar, dialogue, companyName, packageOffered, position } = data;

    if (!studentName || !courseName ) {
        throw new Error('Student name, courseName, dialogue, and company name are required fields.');
    }
    const newPlacement = await prisma.placement.create({
        data: {
            studentName,
            courseName,
            avatar,
            dialogue,
            companyName,
            packageOffered,
            position,
        },
    });

    return newPlacement;
}

const getPlacementById = async (id: number): Promise<any> => {
    const placement = await prisma.placement.findUnique({
        where: { id },
    });
    return placement;
}

const getAllPlacements = async (filters: any): Promise<any[]> => {
    const {isPublic, page = 1, limit = 10 } = filters;
    if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers.');
    }
    if (limit > 50) {
        throw new Error('Limit cannot exceed 50.');
    }
    const skip = (page - 1) * limit;
    const placements = await prisma.placement.findMany({
        where: {
            ...(isPublic !== undefined && { isPublic }),
        },
        orderBy: {
            studentName: 'asc',
        },
        skip,
        take: limit,
    });
    return placements;
}

const updatePlacement = async (id: number, updateData: any): Promise<any> => {
    const allowedFields = ['studentName', 'courseName', 'avatar', 'dialogue', 'companyName', 'packageOffered', 'position', 'isPublic', 'isFeatured'];
    const dataToUpdate: any = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            dataToUpdate[field] = updateData[field];
        }
    }
    const updatedPlacement = await prisma.placement.update({
        where: { id },
        data: dataToUpdate,
    });
    return updatedPlacement;
}

const deletePlacement = async (id: number): Promise<any> => {
    const deletedPlacement = await prisma.placement.delete({
        where: { id },
    });
    return deletedPlacement;
}

export {
    createPlacement,
    getPlacementById,
    getAllPlacements,
    updatePlacement,
    deletePlacement,
};