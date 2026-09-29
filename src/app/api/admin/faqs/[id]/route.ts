import { NextRequest, NextResponse } from 'next/server';
import { getFaqById, updateFaq, deleteFaq } from '@/services/faq.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faqId = parseInt(id);
    
    if (isNaN(faqId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid FAQ ID',
      }, { status: 400 });
    }

    const faq = await getFaqById(faqId);
    
    if (!faq) {
      return NextResponse.json({
        success: false,
        error: 'FAQ not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: faq,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch FAQ',
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faqId = parseInt(id);
    
    if (isNaN(faqId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid FAQ ID',
      }, { status: 400 });
    }

    const body = await request.json();
    const updatedFaq = await updateFaq(faqId, body);
    
    return NextResponse.json({
      success: true,
      data: updatedFaq,
      message: 'FAQ updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update FAQ',
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faqId = parseInt(id);
    
    if (isNaN(faqId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid FAQ ID',
      }, { status: 400 });
    }

    await deleteFaq(faqId);
    
    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete FAQ',
    }, { status: 400 });
  }
}
