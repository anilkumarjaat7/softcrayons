import { NextRequest, NextResponse } from 'next/server';
import { createTutorialsCategory, getAllTutorialsCategories } from '@/services/tutorial-category.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      isPublic: searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    };

    const result = await getAllTutorialsCategories(filters);
    
    return NextResponse.json({
      success: true,
      data: result.categories,
      count: result.totalCount,
      totalPages: result.totalPages,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch tutorials categories',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCategory = await createTutorialsCategory(body);
    
    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Tutorials category created successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create tutorials category',
    }, { status: 400 });
  }
}
