import { prisma } from '../lib/prisma';
import { FacultyEnquiryStatus } from '../../generated/prisma/client';

export type FacultyEnquiryFilters = {
    status?: FacultyEnquiryStatus;
    subStatus?: 'unassigned' | 'assigned';
    assignedToId?: string;
    search?: string;
    page?: number;
    limit?: number;
};

const createFacultyEnquiry = async (enquiryData: any): Promise<any> => {
    const { name, email, phone, message, resume, availableDate } = enquiryData;
    if (!name || !email || !phone) {
        throw new Error('Name, email, and phone are required fields.');
    }
    const newEnquiry = await prisma.facultyEnquiry.create({
        data: {
            name,
            email,
            phone,
            message,
            resume,
            availableDate,
        },
    });
    return newEnquiry;
};

const getFacultyEnquiryById = async (id: number): Promise<any> => {
    const enquiry = await prisma.facultyEnquiry.findUnique({
        where: { id },
        include: {
            assignedTo: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                },
            },
        },
    });
    return enquiry;
};

const getFacultyEnquiries = async (filters: FacultyEnquiryFilters): Promise<{ enquiries: any[]; total: number }> => {
    const { status, subStatus, assignedToId, search, page = 1, limit = 10 } = filters;
    if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers.');
    }
    if (limit > 50) {
        throw new Error('Limit cannot exceed 50.');
    }
    const skip = (page - 1) * limit;

    const where: any = {
        ...(assignedToId && { assignedToId }),
    };

    if (status) {
        where.status = status;
        if (status === 'NEW' && subStatus) {
            if (subStatus === 'unassigned') {
                where.assignedToId = null;
            } else if (subStatus === 'assigned') {
                where.assignedToId = { not: null };
            }
        }
    }

    if (search) {
        where.OR = [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
        ];
    }

    const [enquiries, total] = await Promise.all([
        prisma.facultyEnquiry.findMany({
            where,
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limit,
        }),
        prisma.facultyEnquiry.count({ where }),
    ]);
    
    return { enquiries, total };
};

const getFacultyEnquiryCounts = async (): Promise<Record<string, number>> => {
    const [newUnassigned, newAssigned, contacted, hired, closed, archived] = await Promise.all([
        prisma.facultyEnquiry.count({ where: { status: 'NEW', assignedToId: null } }),
        prisma.facultyEnquiry.count({ where: { status: 'NEW', assignedToId: { not: null } } }),
        prisma.facultyEnquiry.count({ where: { status: 'CONTACTED' } }),
        prisma.facultyEnquiry.count({ where: { status: 'HIRED' } }),
        prisma.facultyEnquiry.count({ where: { status: 'CLOSED' } }),
        prisma.facultyEnquiry.count({ where: { status: 'ARCHIVED' } }),
    ]);
    return {
        NEW: newUnassigned + newAssigned,
        NEW_UNASSIGNED: newUnassigned,
        NEW_ASSIGNED: newAssigned,
        CONTACTED: contacted,
        HIRED: hired,
        CLOSED: closed,
        ARCHIVED: archived,
        TOTAL: newUnassigned + newAssigned + contacted + hired + closed + archived,
    };
};

const assignFacultyEnquiryToHr = async (enquiryId: number, hrId: string): Promise<any> => {
    const updatedEnquiry = await prisma.facultyEnquiry.update({
        where: { id: enquiryId },
        data: { assignedToId: hrId },
    });
    return updatedEnquiry;
};

const updateFacultyEnquiryStatus = async (enquiryId: number, status: FacultyEnquiryStatus): Promise<any> => {
    const updatedEnquiry = await prisma.facultyEnquiry.update({
        where: { id: enquiryId },
        data: { status },
    });
    return updatedEnquiry;
};

const updateFacultyEnquiry = async (enquiryId: number, updateData: any): Promise<any> => {
    const allowedFields = ['name', 'email', 'phone', 'message', 'resume', 'availableDate', 'note', 'remark', 'status', 'assignedToId'];
    const dataToUpdate: any = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            dataToUpdate[field] = updateData[field];
        }
    }
    const updatedEnquiry = await prisma.facultyEnquiry.update({
        where: { id: enquiryId },
        data: dataToUpdate,
    });
    return updatedEnquiry;
};

const deleteFacultyEnquiry = async (enquiryId: number): Promise<any> => {
    const deletedEnquiry = await prisma.facultyEnquiry.delete({
        where: { id: enquiryId },
    });
    return deletedEnquiry;
};

export {
    createFacultyEnquiry,
    getFacultyEnquiryById,
    getFacultyEnquiries,
    getFacultyEnquiryCounts,
    assignFacultyEnquiryToHr,
    updateFacultyEnquiryStatus,
    updateFacultyEnquiry,
    deleteFacultyEnquiry,
};