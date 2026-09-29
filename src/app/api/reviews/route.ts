import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured');
    const minRating = searchParams.get('minRating');

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
      ...(featured === 'true' && { isFeatured: true }),
      ...(minRating && { rating: { gte: parseInt(minRating) } }),
    };

    const totalCount = await prisma.testimonial.count({ where: whereClause });

    const reviews = await prisma.testimonial.findMany({
      where: whereClause,
      select: {
        id: true,
        studentName: true,
        avatar: true,
        rating: true,
        feedback: true,
        isFeatured: true,
        createdAt: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    const avgRating = await prisma.testimonial.aggregate({
      where: { isPublic: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return NextResponse.json({
      success: true,
      data: reviews,
      stats: {
        averageRating: avgRating._avg.rating?.toFixed(1) || '0',
        totalReviews: avgRating._count.rating,
      },
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
      error: error.message || 'Failed to fetch reviews',
    }, { status: 500 });
  }
}
