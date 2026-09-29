import { NextRequest, NextResponse } from 'next/server';
import { createCourseCategory, getAllCourseCategories } from '@/services/course-category.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      isPublic: searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    };

    const categories = await getAllCourseCategories(filters);
    
    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch course categories',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCategory = await createCourseCategory(body);
    
    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Course category created successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create course category',
    }, { status: 400 });
  }
}
