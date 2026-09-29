import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Slug is required',
      }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { 
        slug,
        isPublic: true,
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({
        success: false,
        error: 'Course not found',
      }, { status: 404 });
    }

    const relatedCourses = await prisma.course.findMany({
      where: {
        isPublic: true,
        categoryId: course.categoryId,
        id: { not: course.id },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnailImage: true,
        bannerImage: true,
        duration: true,
        difficulty: true,
        fees: true,
        discount: true,
      },
      take: 4,
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: course,
      relatedCourses,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch course',
    }, { status: 500 });
  }
}
