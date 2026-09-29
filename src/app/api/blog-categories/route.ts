import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.blogCategory.findMany({
      where: {
        isPublic: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        _count: {
          select: {
            blogs: {
              where: { isPublic: true },
            },
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch blog categories',
    }, { status: 500 });
  }
}
