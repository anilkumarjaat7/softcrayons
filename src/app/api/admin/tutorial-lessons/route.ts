import { NextRequest, NextResponse } from 'next/server';
import { createTutorialsLesson, getAllTutorialsLessons } from '@/services/tutorial-lesson.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      isPublic: searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined,
      subtopicId: searchParams.get('subtopicId') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    };

    const result = await getAllTutorialsLessons(filters);
    
    return NextResponse.json({
      success: true,
      data: result.lessons,
      count: result.totalCount,
      totalPages: result.totalPages,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch tutorials lessons',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newLesson = await createTutorialsLesson(body);
    
    return NextResponse.json({
      success: true,
      data: newLesson,
      message: 'Tutorials lesson created successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create tutorials lesson',
    }, { status: 400 });
  }
}
