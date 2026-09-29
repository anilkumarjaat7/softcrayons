import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.tutorialsCategory.findMany({
      where: {
        isPublic: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        logo: true,
        position: true,
        isFeatured: true,
      },
      orderBy: {
        position: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch tutorials categories',
    }, { status: 500 });
  }
}
