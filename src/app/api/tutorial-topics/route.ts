import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get('categorySlug');

    const whereClause: any = {
      isPublic: true,
      ...(categorySlug && { category: { slug: categorySlug } }),
    };

    const topics = await prisma.tutorialsTopic.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        logo: true,
        position: true,
        isFeatured: true,
        category: {
          select: { id: true, title: true, slug: true }
        }
      },
      orderBy: {
        position: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: topics,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch tutorials topics',
    }, { status: 500 });
  }
}
