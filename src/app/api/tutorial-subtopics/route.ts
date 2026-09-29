import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topicSlug = searchParams.get('topicSlug');

    const whereClause: any = {
      isPublic: true,
      ...(topicSlug && { topic: { slug: topicSlug } }),
    };

    const subtopics = await prisma.tutorialsSubTopic.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        logo: true,
        position: true,
        isFeatured: true,
        topic: {
          select: { id: true, title: true, slug: true }
        }
      },
      orderBy: {
        position: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: subtopics,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch tutorials subtopics',
    }, { status: 500 });
  }
}
