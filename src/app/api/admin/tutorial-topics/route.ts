import { NextRequest, NextResponse } from 'next/server';
import { createTutorialsTopic, getAllTutorialsTopics } from '@/services/tutorial-topic.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      isPublic: searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    };

    const result = await getAllTutorialsTopics(filters);
    
    return NextResponse.json({
      success: true,
      data: result.topics,
      count: result.totalCount,
      totalPages: result.totalPages,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch tutorials topics',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTopic = await createTutorialsTopic(body);
    
    return NextResponse.json({
      success: true,
      data: newTopic,
      message: 'Tutorials topic created successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create tutorials topic',
    }, { status: 400 });
  }
}
