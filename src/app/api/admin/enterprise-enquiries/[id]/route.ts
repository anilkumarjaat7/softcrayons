import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getEnterpriseEnquiryById, updateEnterpriseEnquiry, deleteEnterpriseEnquiry } from '@/services/enterprise-enquiry.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'HR' && session.user.role !== 'COUNSELOR')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const { id } = await params;
    const enquiry = await getEnterpriseEnquiryById(Number(id));

    if (!enquiry) {
      return NextResponse.json({
        success: false,
        error: 'Enterprise enquiry not found',
      }, { status: 404 });
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

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'HR' && session.user.role !== 'COUNSELOR')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const enquiry = await updateEnterpriseEnquiry(Number(id), body);

    return NextResponse.json({
      success: true,
      data: enquiry,
    });
  } catch (error: any) {
    console.error('Error updating enterprise enquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update enterprise enquiry',
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin only',
      }, { status: 401 });
    }

    const { id } = await params;
    await deleteEnterpriseEnquiry(Number(id));

    return NextResponse.json({
      success: true,
      message: 'Enterprise enquiry deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting enterprise enquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete enterprise enquiry',
    }, { status: 500 });
  }
}
