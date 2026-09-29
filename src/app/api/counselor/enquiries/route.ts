import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { EnquiryStatus } from '../../../../../generated/prisma/client';

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
    
    const status = searchParams.get('status') as EnquiryStatus | null;
    const search = searchParams.get('search') || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const getCounts = searchParams.get('counts') === 'true';

    if (getCounts) {
      const [newCount, contacted, enrolled, dead, archived] = await Promise.all([
        prisma.enquiry.count({ where: { assignedToId: counselorId, status: 'NEW' } }),
        prisma.enquiry.count({ where: { assignedToId: counselorId, status: 'CONTACTED' } }),
        prisma.enquiry.count({ where: { assignedToId: counselorId, status: 'ENROLLED' } }),
        prisma.enquiry.count({ where: { assignedToId: counselorId, status: 'DEAD' } }),
        prisma.enquiry.count({ where: { assignedToId: counselorId, status: 'ARCHIVED' } }),
      ]);
      
      return NextResponse.json({
        success: true,
        data: {
          NEW: newCount,
          CONTACTED: contacted,
          ENROLLED: enrolled,
          DEAD: dead,
          ARCHIVED: archived,
          TOTAL: newCount + contacted + enrolled + dead + archived,
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
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const skip = (page - 1) * limit;

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
    
    return NextResponse.json({
      success: true,
      data: enquiries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching counselor enquiries:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch enquiries',
    }, { status: 500 });
  }
}
