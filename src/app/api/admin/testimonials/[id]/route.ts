import { NextRequest, NextResponse } from 'next/server';
import { getTestimonialById, updateTestimonial, deleteTestimonial } from '@/services/testimonial.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonialId = parseInt(id);
    
    if (isNaN(testimonialId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid testimonial ID',
      }, { status: 400 });
    }

    const testimonial = await getTestimonialById(testimonialId);
    
    if (!testimonial) {
      return NextResponse.json({
        success: false,
        error: 'Testimonial not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: testimonial,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch testimonial',
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonialId = parseInt(id);
    
    if (isNaN(testimonialId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid testimonial ID',
      }, { status: 400 });
    }

    const body = await request.json();
    const updatedTestimonial = await updateTestimonial(testimonialId, body);
    
    return NextResponse.json({
      success: true,
      data: updatedTestimonial,
      message: 'Testimonial updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update testimonial',
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonialId = parseInt(id);
    
    if (isNaN(testimonialId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid testimonial ID',
      }, { status: 400 });
    }

    await deleteTestimonial(testimonialId);
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete testimonial',
    }, { status: 400 });
  }
}
