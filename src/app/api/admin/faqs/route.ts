import { NextRequest, NextResponse } from 'next/server';
import { createFaq, getAllFaqs } from '@/services/faq.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      categoryId: searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined,
      isPublic: searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    };

    const faqs = await getAllFaqs(filters);
    
    return NextResponse.json({
      success: true,
      data: faqs,
      count: faqs.length,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch FAQs',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newFaq = await createFaq(body);
    
    return NextResponse.json({
      success: true,
      data: newFaq,
      message: 'FAQ created successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create FAQ',
    }, { status: 400 });
  }
}
