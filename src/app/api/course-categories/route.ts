import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.courseCategory.findMany({
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
            courses: {
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
      error: error.message || 'Failed to fetch course categories',
    }, { status: 500 });
  }
}
