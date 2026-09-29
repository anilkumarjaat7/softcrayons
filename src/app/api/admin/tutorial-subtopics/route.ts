import { NextRequest, NextResponse } from 'next/server';
import { createTutorialsSubTopic, getAllTutorialsSubTopics } from '@/services/tutorial-subtopic.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      isPublic: searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined,
      topicId: searchParams.get('topicId') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    };

    const result = await getAllTutorialsSubTopics(filters);
    
    return NextResponse.json({
      success: true,
      data: result.subTopics,
      count: result.totalCount,
      totalPages: result.totalPages,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch tutorials subtopics',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSubTopic = await createTutorialsSubTopic(body);
    
    return NextResponse.json({
      success: true,
      data: newSubTopic,
      message: 'Tutorials subtopic created successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create tutorials subtopic',
    }, { status: 400 });
  }
}
