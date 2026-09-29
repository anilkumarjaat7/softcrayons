import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { EnterpriseEnquiryStatus } from '../../../../../../generated/prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || session.user.role !== 'COUNSELOR') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const { id } = await params;
    const enquiryId = parseInt(id);
    
    if (isNaN(enquiryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid enquiry ID',
      }, { status: 400 });
    }

    const enquiry = await prisma.enterpriseEnquiry.findUnique({
      where: { id: enquiryId },
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

    if (!enquiry) {
      return NextResponse.json({
        success: false,
        error: 'Enterprise enquiry not found',
      }, { status: 404 });
    }

    if (enquiry.assignedToId !== session.user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - This enquiry is not assigned to you',
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: enquiry,
    });
  } catch (error: any) {
    console.error('Error fetching enterprise enquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch enterprise enquiry',
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || session.user.role !== 'COUNSELOR') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const { id } = await params;
    const enquiryId = parseInt(id);
    
    if (isNaN(enquiryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid enquiry ID',
      }, { status: 400 });
    }

    const existingEnquiry = await prisma.enterpriseEnquiry.findUnique({
      where: { id: enquiryId },
      select: { assignedToId: true },
    });

    if (!existingEnquiry) {
      return NextResponse.json({
        success: false,
        error: 'Enterprise enquiry not found',
      }, { status: 404 });
    }

    if (existingEnquiry.assignedToId !== session.user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - This enquiry is not assigned to you',
      }, { status: 403 });
    }

    const body = await request.json();
    
    const allowedFields = ['status', 'note', 'remark'];
    const dataToUpdate: any = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'status') {
          const validStatuses: EnterpriseEnquiryStatus[] = ['NEW', 'CONTACTED', 'COMPLETED', 'CLOSED', 'ARCHIVED'];
          if (!validStatuses.includes(body[field])) {
            return NextResponse.json({
              success: false,
              error: 'Invalid status',
            }, { status: 400 });
          }
        }
        dataToUpdate[field] = body[field];
      }
    }

    if (body.assignedToId !== undefined) {
      return NextResponse.json({
        success: false,
        error: 'You are not authorized to update assignedToId',
      }, { status: 403 });
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid fields to update',
      }, { status: 400 });
    }

    const updatedEnquiry = await prisma.enterpriseEnquiry.update({
      where: { id: enquiryId },
      data: dataToUpdate,
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

    return NextResponse.json({
      success: true,
      data: updatedEnquiry,
    });
  } catch (error: any) {
    console.error('Error updating enterprise enquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update enterprise enquiry',
    }, { status: 500 });
  }
}
