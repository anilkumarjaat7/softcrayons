import { NextRequest, NextResponse } from 'next/server';
import { getBlogCategoryById, updateBlogCategory, deleteBlogCategory } from '@/services/blog-category.service';

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

    const category = await getBlogCategoryById(categoryId);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Blog category not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: category,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch blog category',
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
    const updatedCategory = await updateBlogCategory(categoryId, body);
    
    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Blog category updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update blog category',
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

    await deleteBlogCategory(categoryId);
    
    return NextResponse.json({
      success: true,
      message: 'Blog category deleted successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete blog category',
    }, { status: 400 });
  }
}
