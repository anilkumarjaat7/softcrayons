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
          { question: { contains: search, mode: 'insensitive' } },
          { answer: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(categorySlug && { category: { slug: categorySlug } }),
    };

    const totalCount = await prisma.faq.count({ where: whereClause });

    const faqs = await prisma.faq.findMany({
      where: whereClause,
      select: {
        id: true,
        question: true,
        answer: true,
        slug: true,
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        question: 'asc',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: faqs,
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
      error: error.message || 'Failed to fetch FAQs',
    }, { status: 500 });
  }
}
