import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { FacultyEnquiryStatus } from '../../../../../generated/prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || session.user.role !== 'HR') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const hrId = session.user.id;
    const searchParams = request.nextUrl.searchParams;
    
    const status = searchParams.get('status') as FacultyEnquiryStatus | null;
    const search = searchParams.get('search') || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const getCounts = searchParams.get('counts') === 'true';

    if (getCounts) {
      const [newCount, contacted, hired, closed, archived] = await Promise.all([
        prisma.facultyEnquiry.count({ where: { assignedToId: hrId, status: 'NEW' } }),
        prisma.facultyEnquiry.count({ where: { assignedToId: hrId, status: 'CONTACTED' } }),
        prisma.facultyEnquiry.count({ where: { assignedToId: hrId, status: 'HIRED' } }),
        prisma.facultyEnquiry.count({ where: { assignedToId: hrId, status: 'CLOSED' } }),
        prisma.facultyEnquiry.count({ where: { assignedToId: hrId, status: 'ARCHIVED' } }),
      ]);
      
      return NextResponse.json({
        success: true,
        data: {
          NEW: newCount,
          CONTACTED: contacted,
          HIRED: hired,
          CLOSED: closed,
          ARCHIVED: archived,
          TOTAL: newCount + contacted + hired + closed + archived,
        },
      });
    }

    const where: any = {
      assignedToId: hrId,
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
    
    return NextResponse.json({
      success: true,
      data: enquiries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching HR faculty enquiries:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch faculty enquiries',
    }, { status: 500 });
  }
}
