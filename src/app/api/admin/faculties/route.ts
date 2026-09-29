import { NextRequest, NextResponse } from 'next/server';
import { createFaculty, getAllFaculties } from '@/services/faculty.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    };

    const faculties = await getAllFaculties(filters);
    
    return NextResponse.json({
      success: true,
      data: faculties,
      count: faculties.length,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch faculties',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newFaculty = await createFaculty(body);
    
    return NextResponse.json({
      success: true,
      data: newFaculty,
      message: 'Faculty created successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create faculty',
    }, { status: 400 });
  }
}
