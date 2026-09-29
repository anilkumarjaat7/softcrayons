import { prisma } from '../lib/prisma';
import { EnterpriseEnquiryStatus } from '../../generated/prisma/client';

export type EnterpriseEnquiryFilters = {
    status?: EnterpriseEnquiryStatus;
    subStatus?: 'unassigned' | 'assigned';
    assignedToId?: string;
    search?: string;
    page?: number;
    limit?: number;
};

const createEnterpriseEnquiry = async (enquiryData: any): Promise<any> => {
    const { companyName, email, phone, message, duration } = enquiryData;
    if (!companyName || !email || !phone) {
        throw new Error('Company name, email, and phone are required fields.');
    }
    const newEnquiry = await prisma.enterpriseEnquiry.create({
        data: {
            companyName,
            email,
            phone,
            message,
            duration,
        },
    });
    return newEnquiry;
};

const getEnterpriseEnquiryById = async (id: number): Promise<any> => {
    const enquiry = await prisma.enterpriseEnquiry.findUnique({
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

const getEnterpriseEnquiries = async (filters: EnterpriseEnquiryFilters): Promise<{ enquiries: any[]; total: number }> => {
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
            { companyName: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
        ];
    }

    const [enquiries, total] = await Promise.all([
        prisma.enterpriseEnquiry.findMany({
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
        prisma.enterpriseEnquiry.count({ where }),
    ]);
    
    return { enquiries, total };
};

const getEnterpriseEnquiryCounts = async (): Promise<Record<string, number>> => {
    const [newUnassigned, newAssigned, contacted, completed, closed, archived] = await Promise.all([
        prisma.enterpriseEnquiry.count({ where: { status: 'NEW', assignedToId: null } }),
        prisma.enterpriseEnquiry.count({ where: { status: 'NEW', assignedToId: { not: null } } }),
        prisma.enterpriseEnquiry.count({ where: { status: 'CONTACTED' } }),
        prisma.enterpriseEnquiry.count({ where: { status: 'COMPLETED' } }),
        prisma.enterpriseEnquiry.count({ where: { status: 'CLOSED' } }),
        prisma.enterpriseEnquiry.count({ where: { status: 'ARCHIVED' } }),
    ]);
    return {
        NEW: newUnassigned + newAssigned,
        NEW_UNASSIGNED: newUnassigned,
        NEW_ASSIGNED: newAssigned,
        CONTACTED: contacted,
        COMPLETED: completed,
        CLOSED: closed,
        ARCHIVED: archived,
        TOTAL: newUnassigned + newAssigned + contacted + completed + closed + archived,
    };
};

const assignEnterpriseEnquiryToUser = async (enquiryId: number, userId: string): Promise<any> => {
    const updatedEnquiry = await prisma.enterpriseEnquiry.update({
        where: { id: enquiryId },
        data: { assignedToId: userId },
    });
    return updatedEnquiry;
};

const updateEnterpriseEnquiryStatus = async (enquiryId: number, status: EnterpriseEnquiryStatus): Promise<any> => {
    const updatedEnquiry = await prisma.enterpriseEnquiry.update({
        where: { id: enquiryId },
        data: { status },
    });
    return updatedEnquiry;
};

const updateEnterpriseEnquiry = async (enquiryId: number, updateData: any): Promise<any> => {
    const allowedFields = ['companyName', 'email', 'phone', 'message', 'duration', 'note', 'remark', 'status', 'assignedToId'];
    const dataToUpdate: any = {};
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            dataToUpdate[field] = updateData[field];
        }
    }
    const updatedEnquiry = await prisma.enterpriseEnquiry.update({
        where: { id: enquiryId },
        data: dataToUpdate,
    });
    return updatedEnquiry;
};

const deleteEnterpriseEnquiry = async (enquiryId: number): Promise<any> => {
    const deletedEnquiry = await prisma.enterpriseEnquiry.delete({
        where: { id: enquiryId },
    });
    return deletedEnquiry;
};

export {
    createEnterpriseEnquiry,
    getEnterpriseEnquiryById,
    getEnterpriseEnquiries,
    getEnterpriseEnquiryCounts,
    assignEnterpriseEnquiryToUser,
    updateEnterpriseEnquiryStatus,
    updateEnterpriseEnquiry,
    deleteEnterpriseEnquiry
};