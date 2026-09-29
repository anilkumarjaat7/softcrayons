import { NextRequest, NextResponse } from 'next/server';
import { getTutorialsTopicById, updateTutorialsTopic, deleteTutorialsTopic } from '@/services/tutorial-topic.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const topicId = parseInt(id);
    
    if (isNaN(topicId)) {
      return NextResponse.json({ success: false, error: 'Invalid topic ID' }, { status: 400 });
    }

    const topic = await getTutorialsTopicById(topicId);
    
    if (!topic) {
      return NextResponse.json({ success: false, error: 'Tutorials topic not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: topic }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch tutorials topic' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const topicId = parseInt(id);
    
    if (isNaN(topicId)) {
      return NextResponse.json({ success: false, error: 'Invalid topic ID' }, { status: 400 });
    }

    const body = await request.json();
    const updatedTopic = await updateTutorialsTopic(topicId, body);
    
    return NextResponse.json({
      success: true,
      data: updatedTopic,
      message: 'Tutorials topic updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update tutorials topic' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const topicId = parseInt(id);
    
    if (isNaN(topicId)) {
      return NextResponse.json({ success: false, error: 'Invalid topic ID' }, { status: 400 });
    }

    await deleteTutorialsTopic(topicId);
    
    return NextResponse.json({ success: true, message: 'Tutorials topic deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete tutorials topic' }, { status: 400 });
  }
}
