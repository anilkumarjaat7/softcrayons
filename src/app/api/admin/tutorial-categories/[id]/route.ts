import { NextRequest, NextResponse } from 'next/server';
import { getTutorialsCategoryById, updateTutorialsCategory, deleteTutorialsCategory } from '@/services/tutorial-category.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json({ success: false, error: 'Invalid category ID' }, { status: 400 });
    }

    const category = await getTutorialsCategoryById(categoryId);
    
    if (!category) {
      return NextResponse.json({ success: false, error: 'Tutorials category not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: category }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch tutorials category' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'Invalid category ID' }, { status: 400 });
    }

    const body = await request.json();
    const updatedCategory = await updateTutorialsCategory(categoryId, body);
    
    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Tutorials category updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update tutorials category' }, { status: 400 });
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
      return NextResponse.json({ success: false, error: 'Invalid category ID' }, { status: 400 });
    }

    await deleteTutorialsCategory(categoryId);
    
    return NextResponse.json({ success: true, message: 'Tutorials category deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete tutorials category' }, { status: 400 });
  }
}
