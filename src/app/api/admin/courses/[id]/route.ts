import { NextRequest, NextResponse } from 'next/server';
import { getCourseById, updateCourse, deleteCourse } from '@/services/course.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);
    
    if (isNaN(courseId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid course ID',
      }, { status: 400 });
    }

    const course = await getCourseById(courseId);
    
    if (!course) {
      return NextResponse.json({
        success: false,
        error: 'Course not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: course,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch course',
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);
    
    if (isNaN(courseId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid course ID',
      }, { status: 400 });
    }

    const body = await request.json();
    const updatedCourse = await updateCourse(courseId, body);
    
    return NextResponse.json({
      success: true,
      data: updatedCourse,
      message: 'Course updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update course',
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);
    
    if (isNaN(courseId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid course ID',
      }, { status: 400 });
    }

    await deleteCourse(courseId);
    
    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete course',
    }, { status: 400 });
  }
}
