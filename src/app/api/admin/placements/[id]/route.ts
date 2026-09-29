import { NextRequest, NextResponse } from 'next/server';
import { getPlacementById, updatePlacement, deletePlacement } from '@/services/placement.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const placementId = parseInt(id);
    
    if (isNaN(placementId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid placement ID',
      }, { status: 400 });
    }

    const placement = await getPlacementById(placementId);
    
    if (!placement) {
      return NextResponse.json({
        success: false,
        error: 'Placement not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: placement,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch placement',
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const placementId = parseInt(id);
    
    if (isNaN(placementId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid placement ID',
      }, { status: 400 });
    }

    const body = await request.json();
    const updatedPlacement = await updatePlacement(placementId, body);
    
    return NextResponse.json({
      success: true,
      data: updatedPlacement,
      message: 'Placement updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update placement',
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const placementId = parseInt(id);
    
    if (isNaN(placementId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid placement ID',
      }, { status: 400 });
    }

    await deletePlacement(placementId);
    
    return NextResponse.json({
      success: true,
      message: 'Placement deleted successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete placement',
    }, { status: 400 });
  }
}
