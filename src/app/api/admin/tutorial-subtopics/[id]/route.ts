import { NextRequest, NextResponse } from 'next/server';
import { getTutorialsSubTopicById, updateTutorialsSubTopic, deleteTutorialsSubTopic } from '@/services/tutorial-subtopic.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subtopicId = parseInt(id);
    
    if (isNaN(subtopicId)) {
      return NextResponse.json({ success: false, error: 'Invalid subtopic ID' }, { status: 400 });
    }

    const subTopic = await getTutorialsSubTopicById(subtopicId);
    
    if (!subTopic) {
      return NextResponse.json({ success: false, error: 'Tutorials subtopic not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: subTopic }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch tutorials subtopic' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subtopicId = parseInt(id);
    
    if (isNaN(subtopicId)) {
      return NextResponse.json({ success: false, error: 'Invalid subtopic ID' }, { status: 400 });
    }

    const body = await request.json();
    const updatedSubTopic = await updateTutorialsSubTopic(subtopicId, body);
    
    return NextResponse.json({
      success: true,
      data: updatedSubTopic,
      message: 'Tutorials subtopic updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update tutorials subtopic' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subtopicId = parseInt(id);
    
    if (isNaN(subtopicId)) {
      return NextResponse.json({ success: false, error: 'Invalid subtopic ID' }, { status: 400 });
    }

    await deleteTutorialsSubTopic(subtopicId);
    
    return NextResponse.json({ success: true, message: 'Tutorials subtopic deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete tutorials subtopic' }, { status: 400 });
  }
}
