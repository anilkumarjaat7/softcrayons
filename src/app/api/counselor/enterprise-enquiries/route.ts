import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { EnterpriseEnquiryStatus } from '../../../../../generated/prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || session.user.role !== 'COUNSELOR') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const counselorId = session.user.id;
    const searchParams = request.nextUrl.searchParams;
    
    const status = searchParams.get('status') as EnterpriseEnquiryStatus | null;
    const search = searchParams.get('search') || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const getCounts = searchParams.get('counts') === 'true';

    if (getCounts) {
      const [newCount, contacted, completed, closed, archived] = await Promise.all([
        prisma.enterpriseEnquiry.count({ where: { assignedToId: counselorId, status: 'NEW' } }),
        prisma.enterpriseEnquiry.count({ where: { assignedToId: counselorId, status: 'CONTACTED' } }),
        prisma.enterpriseEnquiry.count({ where: { assignedToId: counselorId, status: 'COMPLETED' } }),
        prisma.enterpriseEnquiry.count({ where: { assignedToId: counselorId, status: 'CLOSED' } }),
        prisma.enterpriseEnquiry.count({ where: { assignedToId: counselorId, status: 'ARCHIVED' } }),
      ]);
      
      return NextResponse.json({
        success: true,
        data: {
          NEW: newCount,
          CONTACTED: contacted,
          COMPLETED: completed,
          CLOSED: closed,
          ARCHIVED: archived,
          TOTAL: newCount + contacted + completed + closed + archived,
        },
      });
    }

    const where: any = {
      assignedToId: counselorId,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const skip = (page - 1) * limit;

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
    
    return NextResponse.json({
      success: true,
      data: enquiries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching counselor enterprise enquiries:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch enterprise enquiries',
    }, { status: 500 });
  }
}
