import { NextRequest, NextResponse } from 'next/server';
import { getFaqCategoryById, updateFaqCategory, deleteFaqCategory } from '@/services/faq-category.service';

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

    const category = await getFaqCategoryById(categoryId);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'FAQ category not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: category,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch FAQ category',
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
    const updatedCategory = await updateFaqCategory(categoryId, body);
    
    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'FAQ category updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update FAQ category',
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

    await deleteFaqCategory(categoryId);
    
    return NextResponse.json({
      success: true,
      message: 'FAQ category deleted successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete FAQ category',
    }, { status: 400 });
  }
}
