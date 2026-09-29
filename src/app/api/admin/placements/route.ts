import { NextRequest, NextResponse } from 'next/server';
import { createPlacement, getAllPlacements } from '@/services/placement.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      isPublic: searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    };

    const placements = await getAllPlacements(filters);
    
    return NextResponse.json({
      success: true,
      data: placements,
      count: placements.length,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch placements',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPlacement = await createPlacement(body);
    
    return NextResponse.json({
      success: true,
      data: newPlacement,
      message: 'Placement created successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create placement',
    }, { status: 400 });
  }
}
