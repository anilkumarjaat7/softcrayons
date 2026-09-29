import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getEnquiries, getEnquiryCounts, type EnquiryFilters } from '@/services/enquiry.service';
import { EnquiryStatus } from '../../../../../generated/prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'COUNSELOR')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    
    const status = searchParams.get('status') as EnquiryStatus | null;
    const subStatus = searchParams.get('subStatus') as 'unassigned' | 'assigned' | null;
    const search = searchParams.get('search') || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const courseId = searchParams.get('courseId') ? parseInt(searchParams.get('courseId')!) : undefined;
    const assignedToId = searchParams.get('assignedToId') || undefined;
    const agentId = searchParams.get('agentId') || undefined;
    const getCounts = searchParams.get('counts') === 'true';

    if (getCounts) {
      const counts = await getEnquiryCounts();
      return NextResponse.json({
        success: true,
        data: counts,
      });
    }

    const filters: EnquiryFilters = {
      status: status || undefined,
      subStatus: subStatus || undefined,
      search,
      page,
      limit,
      courseId,
      assignedToId,
      agentId,
    };

    const { enquiries, total } = await getEnquiries(filters);
    
    return NextResponse.json({
      success: true,
      data: enquiries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch enquiries',
    }, { status: 500 });
  }
}
