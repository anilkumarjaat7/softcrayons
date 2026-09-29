import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
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
      ...(featured === 'true' && { isFeatured: true }),
    };

    const totalCount = await prisma.faculty.count({ where: whereClause });

    const faculties = await prisma.faculty.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        designation: true,
        domain: true,
        avatar: true,
        bio: true,
        experience: true,
        ProjectsHandled: true,
        studentsMentored: true,
        ratings: true,
        technologies: true,
        locations: true,
        isFeatured: true,
      },
      orderBy: {
        name: 'asc',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: faculties,
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
      error: error.message || 'Failed to fetch faculties',
    }, { status: 500 });
  }
}
