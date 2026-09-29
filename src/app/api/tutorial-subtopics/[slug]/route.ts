import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const subtopic = await prisma.tutorialsSubTopic.findUnique({
      where: { 
        slug,
        isPublic: true,
      },
      include: {
        topic: {
          select: { 
            id: true, title: true, slug: true,
            category: { select: { id: true, title: true, slug: true } }
          }
        },
        lessons: {
          where: { isPublic: true },
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            position: true,
            logo: true,
          }
        }
      }
    });

    if (!subtopic) {
      return NextResponse.json({ success: false, error: 'Subtopic not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: subtopic,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch subtopic',
    }, { status: 500 });
  }
}
