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

    const faq = await prisma.faq.findUnique({
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

    if (!faq) {
      return NextResponse.json({
        success: false,
        error: 'FAQ not found',
      }, { status: 404 });
    }

    const relatedFaqs = await prisma.faq.findMany({
      where: {
        isPublic: true,
        categoryId: faq.categoryId,
        id: { not: faq.id },
      },
      select: {
        id: true,
        question: true,
        answer: true,
        slug: true,
      },
      take: 5,
      orderBy: {
        question: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: faq,
      relatedFaqs,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch FAQ',
    }, { status: 500 });
  }
}
