import { prisma } from '../lib/prisma';
import { EnquiryStatus } from '../../generated/prisma/client';

export type EnquiryFilters = {
    status?: EnquiryStatus;
    subStatus?: 'unassigned' | 'assigned';
    courseId?: number;
    assignedToId?: string;
    agentId?: string;
    search?: string;
    page?: number;
    limit?: number;
};

const createEnquiry = async (enquiryData: any): Promise<any> => {
    const { name, email, phone, courseId, message } = enquiryData;
    if (!name || !email || !phone) {
        throw new Error('Name, email, and phone are required fields.');
    }
    const newEnquiry = await prisma.enquiry.create({
        data: {
            name,
            email,
            phone,
            courseId,
            message,
        },
    });
    return newEnquiry;

};

const getEnquiryById = async (id: number): Promise<any> => {
    const enquiry = await prisma.enquiry.findUnique({
        where: { id },
        include: {
            course: true,
            assignedTo: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                },
            },
            agent: {
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
}

const getEnquiries = async (filters: EnquiryFilters): Promise<{ enquiries: any[]; total: number }> => {
    const { status, subStatus, courseId, assignedToId, agentId, search, page = 1, limit = 10 } = filters;
    if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers.');
    }
    if (limit > 50) {
        throw new Error('Limit cannot exceed 50.');
    }
    const skip = (page - 1) * limit;
    
    const where: any = {
        ...(courseId && { courseId }),
        ...(assignedToId && { assignedToId }),
        ...(agentId && { agentId }),
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
        prisma.enquiry.findMany({
            where,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
                agent: {
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
        prisma.enquiry.count({ where }),
    ]);
    
    return { enquiries, total };
}

const getEnquiryCounts = async (): Promise<Record<string, number>> => {
    const [newUnassigned, newAssigned, contacted, enrolled, dead, archived] = await Promise.all([
        prisma.enquiry.count({ where: { status: 'NEW', assignedToId: null } }),
        prisma.enquiry.count({ where: { status: 'NEW', assignedToId: { not: null } } }),
        prisma.enquiry.count({ where: { status: 'CONTACTED' } }),
        prisma.enquiry.count({ where: { status: 'ENROLLED' } }),
        prisma.enquiry.count({ where: { status: 'DEAD' } }),
        prisma.enquiry.count({ where: { status: 'ARCHIVED' } }),
    ]);
    return {
        NEW: newUnassigned + newAssigned,
        NEW_UNASSIGNED: newUnassigned,
        NEW_ASSIGNED: newAssigned,
        CONTACTED: contacted,
        ENROLLED: enrolled,
        DEAD: dead,
        ARCHIVED: archived,
        TOTAL: newUnassigned + newAssigned + contacted + enrolled + dead + archived,
    };
}

const assignEnquiryToCounselor = async (enquiryId: number, counselorId: string): Promise<any> => {
    const updatedEnquiry = await prisma.enquiry.update({
        where: { id: enquiryId },
        data: { assignedToId: counselorId },
    });
    return updatedEnquiry;
}

const addAgentToEnquiry = async (enquiryId: number, agentId: string): Promise<any> => {
    const updatedEnquiry = await prisma.enquiry.update({
        where: { id: enquiryId },
        data: { agentId },
    });
    return updatedEnquiry;
}

const updateEnquiryStatus = async (enquiryId: number, status: EnquiryStatus): Promise<any> => {
    const updatedEnquiry = await prisma.enquiry.update({
        where: { id: enquiryId },
        data: { status },
    });
    return updatedEnquiry;
}

const updateEnquiry = async (enquiryId: number, updateData: any): Promise<any> => {
    const allowedFields = ['name', 'email', 'phone', 'courseId', 'message', 'note', 'remark', 'status', 'assignedToId', 'agentId', 'assignedAt'];
    const dataToUpdate: any = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            dataToUpdate[field] = updateData[field];
        }
    }
    const updatedEnquiry = await prisma.enquiry.update({
        where: { id: enquiryId },
        data: dataToUpdate,
    });
    return updatedEnquiry;
}

const deleteEnquiry = async (enquiryId: number): Promise<any> => {
    const deletedEnquiry = await prisma.enquiry.delete({
        where: { id: enquiryId },
    });
    return deletedEnquiry;
}

export { createEnquiry, getEnquiryById, getEnquiries, getEnquiryCounts, addAgentToEnquiry, assignEnquiryToCounselor, updateEnquiryStatus, updateEnquiry, deleteEnquiry };