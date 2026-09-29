import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subtopicSlug = searchParams.get('subtopicSlug');

    const whereClause: any = {
      isPublic: true,
      ...(subtopicSlug && { subtopic: { slug: subtopicSlug } }),
    };

    const lessons = await prisma.tutorialsLesson.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        logo: true,
        position: true,
        isFeatured: true,
        subtopic: {
          select: { id: true, title: true, slug: true }
        }
      },
      orderBy: {
        position: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: lessons,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch tutorials lessons',
    }, { status: 500 });
  }
}
