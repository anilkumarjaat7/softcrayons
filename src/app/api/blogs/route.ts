import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const categorySlug = searchParams.get('categorySlug');
    const featured = searchParams.get('featured');

    if (page < 1 || limit < 1) {
      return NextResponse.json({
        success: false,
        error: 'Page and limit must be positive integers.',
      }, { status: 400 });
    }

    if (limit > 50) {
      return NextResponse.json({
        success: false,
        error: 'Limit cannot exceed 50.',
      }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    const whereClause: any = {
      isPublic: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(categorySlug && { category: { slug: categorySlug } }),
      ...(featured === 'true' && { isFeatured: true }),
    };

    const totalCount = await prisma.blog.count({ where: whereClause });

    const blogs = await prisma.blog.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnailImage: true,
        bannerImage: true,
        dateOfPublish: true,
        readTime: true,
        tags: true,
        isFeatured: true,
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
      orderBy: {
        dateOfPublish: 'desc',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch blogs',
    }, { status: 500 });
  }
}
