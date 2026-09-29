import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getEnquiryById, updateEnquiry, deleteEnquiry } from '@/services/enquiry.service';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'COUNSELOR')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const { id } = await context.params;
    const enquiryId = parseInt(id);
    
    if (isNaN(enquiryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid enquiry ID',
      }, { status: 400 });
    }

    const enquiry = await getEnquiryById(enquiryId);
    
    if (!enquiry) {
      return NextResponse.json({
        success: false,
        error: 'Enquiry not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: enquiry,
    });
  } catch (error: any) {
    console.error('Error fetching enquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch enquiry',
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'COUNSELOR')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const { id } = await context.params;
    const enquiryId = parseInt(id);
    
    if (isNaN(enquiryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid enquiry ID',
      }, { status: 400 });
    }

    const body = await request.json();
    const { assignedToId, agentId, status, note, remark } = body;

    const updateData: any = {};
    
    if (assignedToId !== undefined) {
      updateData.assignedToId = assignedToId || null;
      if (assignedToId) {
        updateData.assignedAt = new Date();
      }
    }
    
    if (agentId !== undefined) {
      updateData.agentId = agentId || null;
    }
    
    if (status !== undefined) {
      updateData.status = status;
    }
    
    if (note !== undefined) {
      updateData.note = note;
    }
    
    if (remark !== undefined) {
      updateData.remark = remark;
    }

    const updatedEnquiry = await updateEnquiry(enquiryId, updateData);

    return NextResponse.json({
      success: true,
      data: updatedEnquiry,
      message: 'Enquiry updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update enquiry',
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const { id } = await context.params;
    const enquiryId = parseInt(id);
    
    if (isNaN(enquiryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid enquiry ID',
      }, { status: 400 });
    }

    await deleteEnquiry(enquiryId);

    return NextResponse.json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete enquiry',
    }, { status: 500 });
  }
}
