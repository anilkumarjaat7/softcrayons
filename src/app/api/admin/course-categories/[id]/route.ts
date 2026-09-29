import { NextRequest, NextResponse } from 'next/server';
import { getCourseCategoryById, updateCourseCategory, deleteCourseCategory } from '@/services/course-category.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category ID',
      }, { status: 400 });
    }

    const category = await getCourseCategoryById(categoryId);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Course category not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: category,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch course category',
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category ID',
      }, { status: 400 });
    }

    const body = await request.json();
    const updatedCategory = await updateCourseCategory(categoryId, body);
    
    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Course category updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update course category',
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category ID',
      }, { status: 400 });
    }

    await deleteCourseCategory(categoryId);
    
    return NextResponse.json({
      success: true,
      message: 'Course category deleted successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete course category',
    }, { status: 400 });
  }
}
