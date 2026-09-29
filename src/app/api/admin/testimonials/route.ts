import { NextRequest, NextResponse } from 'next/server';
import { createTestimonial, getAllTestimonials } from '@/services/testimonial.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      isPublic: searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    };

    const testimonials = await getAllTestimonials(filters);
    
    return NextResponse.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch testimonials',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTestimonial = await createTestimonial(body);
    
    return NextResponse.json({
      success: true,
      data: newTestimonial,
      message: 'Testimonial created successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create testimonial',
    }, { status: 400 });
  }
}
