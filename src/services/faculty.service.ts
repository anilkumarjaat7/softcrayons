import { prisma } from '../lib/prisma';

const createFaculty = async (data: any): Promise<any> => {
    const { name, designation, domain, avatar, bio, experience, ProjectsHandled, studentsMentored, ratings, technologies, locations } = data;

    if (!name || !designation) {
        throw new Error('Name and designation are required fields.');
    }

    const newFaculty = await prisma.faculty.create({
        data: {
            name,
            designation,
            domain,
            avatar,
            bio,
            experience,
            ProjectsHandled,
            studentsMentored,
            ratings,
            technologies,
            locations,
        },
    });

    return newFaculty;
}

const getFacultyById = async (id: number): Promise<any> => {
    const faculty = await prisma.faculty.findUnique({
        where: { id },
    });
    return faculty;
}

const getAllFaculties = async (filters: any): Promise<any[]> => {
    const { page = 1, limit = 10 } = filters;
    if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers.');
    }
    if (limit > 50) {
        throw new Error('Limit cannot exceed 50.');
    }
    const skip = (page - 1) * limit;
    const faculties = await prisma.faculty.findMany({
        orderBy: {
            name: 'asc',
        },
        skip,
        take: limit,
    });
    return faculties;
}

const updateFaculty = async (id: number, updateData: any): Promise<any> => {
    const allowedFields = ['name', 'designation', 'domain', 'avatar', 'bio', 'experience', 'ProjectsHandled', 'studentsMentored', 'ratings', 'technologies', 'locations', 'isPublic', 'isFeatured'];
    const dataToUpdate: any = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            dataToUpdate[field] = updateData[field];
        }
    }
    const updatedFaculty = await prisma.faculty.update({
        where: { id },
        data: dataToUpdate,
    });
    return updatedFaculty;
}

const deleteFaculty = async (id: number): Promise<any> => {
    const deletedFaculty = await prisma.faculty.delete({
        where: { id },
    });
    return deletedFaculty;
}

export {
    createFaculty,
    getFacultyById,
    getAllFaculties,
    updateFaculty,
    deleteFaculty,
};