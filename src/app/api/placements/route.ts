import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const featured = searchParams.get('featured');
    const company = searchParams.get('company');
    const course = searchParams.get('course');

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
      ...(company && { companyName: { contains: company, mode: 'insensitive' } }),
      ...(course && { courseName: { contains: course, mode: 'insensitive' } }),
      ...(search && {
        OR: [
          { studentName: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
          { courseName: { contains: search, mode: 'insensitive' } },
          { position: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const totalCount = await prisma.placement.count({ where: whereClause });

    const placements = await prisma.placement.findMany({
      where: whereClause,
      select: {
        id: true,
        studentName: true,
        avatar: true,
        courseName: true,
        dialogue: true,
        packageOffered: true,
        companyName: true,
        position: true,
        isFeatured: true,
        createdAt: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    const uniqueCompanies = await prisma.placement.groupBy({
      by: ['companyName'],
      where: { isPublic: true, companyName: { not: null } },
    });

    return NextResponse.json({
      success: true,
      data: placements,
      stats: {
        totalPlacements: totalCount,
        uniqueCompanies: uniqueCompanies.length,
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
      error: error.message || 'Failed to fetch placements',
    }, { status: 500 });
  }
}
