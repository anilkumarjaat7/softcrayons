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

    const blog = await prisma.blog.findUnique({
      where: { 
        slug,
        isPublic: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({
        success: false,
        error: 'Blog not found',
      }, { status: 404 });
    }

    const relatedBlogs = await prisma.blog.findMany({
      where: {
        isPublic: true,
        categoryId: blog.categoryId,
        id: { not: blog.id },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnailImage: true,
        dateOfPublish: true,
        readTime: true,
      },
      take: 4,
      orderBy: {
        dateOfPublish: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: blog,
      relatedBlogs,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch blog',
    }, { status: 500 });
  }
}
