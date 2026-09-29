import { NextRequest, NextResponse } from 'next/server';
import { getTutorialsLessonById, updateTutorialsLesson, deleteTutorialsLesson } from '@/services/tutorial-lesson.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lessonId = parseInt(id);
    
    if (isNaN(lessonId)) {
      return NextResponse.json({ success: false, error: 'Invalid lesson ID' }, { status: 400 });
    }

    const lesson = await getTutorialsLessonById(lessonId);
    
    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Tutorials lesson not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: lesson }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch tutorials lesson' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lessonId = parseInt(id);
    
    if (isNaN(lessonId)) {
      return NextResponse.json({ success: false, error: 'Invalid lesson ID' }, { status: 400 });
    }

    const body = await request.json();
    const updatedLesson = await updateTutorialsLesson(lessonId, body);
    
    return NextResponse.json({
      success: true,
      data: updatedLesson,
      message: 'Tutorials lesson updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update tutorials lesson' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lessonId = parseInt(id);
    
    if (isNaN(lessonId)) {
      return NextResponse.json({ success: false, error: 'Invalid lesson ID' }, { status: 400 });
    }

    await deleteTutorialsLesson(lessonId);
    
    return NextResponse.json({ success: true, message: 'Tutorials lesson deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete tutorials lesson' }, { status: 400 });
  }
}
