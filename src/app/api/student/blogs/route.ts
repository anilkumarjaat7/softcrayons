import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromHeaders } from "@/lib/request-user";

export async function GET() {
  try {
    const user = await getUserFromHeaders();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const blogs = await prisma.blog.findMany({
      where: {
        authorId: user.id,
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromHeaders();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        content: body.content,
        categoryId: body.categoryId,
        authorId: user.id,
        dateOfPublish: new Date(),
        isPublic: false,
        isFeatured: false,
        readTime: body.readTime || 5,
        tags: body.tags || [],
        tableOfContents: body.tableOfContents || [],
        bannerImage: body.bannerImage,
        thumbnailImage: body.thumbnailImage,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        metaKeywords: body.metaKeywords || [],
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
