import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    const query: any = {
      limit,
    };

    if (search) {
      query.searchValue = search;
      query.searchField = 'name';
      query.searchOperator = 'contains';
    }

    if (role) {
      query.filterField = 'role';
      query.filterValue = role;
      query.filterOperator = 'eq';
    }

    const result = await auth.api.listUsers({
      headers: await headers(),
      query,
    });

    let users = result?.users || [];
    if (isActive !== null && isActive !== undefined) {
      const shouldBeActive = isActive === 'true';
      users = users.filter((user: any) => shouldBeActive ? !user.banned : user.banned);
    }
    
    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch users',
    }, { status: 500 });
  }
}
