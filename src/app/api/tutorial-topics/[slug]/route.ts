import { NextRequest, NextResponse } from 'next/server';
import { getPublicTutorialTopicBySlug } from '@/services/tutorial-public.service';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const topic = await getPublicTutorialTopicBySlug(slug);

    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: topic,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch topic',
    }, { status: 500 });
  }
}
