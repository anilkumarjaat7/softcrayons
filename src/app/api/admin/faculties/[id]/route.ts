import { NextRequest, NextResponse } from 'next/server';
import { getFacultyById, updateFaculty, deleteFaculty } from '@/services/faculty.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faculty = await getFacultyById(parseInt(id));
    
    if (!faculty) {
      return NextResponse.json({
        success: false,
        error: 'Faculty not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: faculty,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch faculty',
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedFaculty = await updateFaculty(parseInt(id), body);
    
    return NextResponse.json({
      success: true,
      data: updatedFaculty,
      message: 'Faculty updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update faculty',
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteFaculty(parseInt(id));
    
    return NextResponse.json({
      success: true,
      message: 'Faculty deleted successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete faculty',
    }, { status: 500 });
  }
}
