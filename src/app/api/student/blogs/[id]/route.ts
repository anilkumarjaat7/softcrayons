import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromHeaders } from "@/lib/request-user";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromHeaders();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const blogId = parseInt(id);

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
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

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    if (blog.authorId !== user.id) {
      return NextResponse.json(
        { success: false, error: "You can only view your own blogs" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromHeaders();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const blogId = parseInt(id);

    const existingBlog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    if (existingBlog.authorId !== user.id) {
      return NextResponse.json(
        { success: false, error: "You can only edit your own blogs" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const blog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        content: body.content,
        categoryId: body.categoryId,
        readTime: body.readTime,
        tags: body.tags,
        tableOfContents: body.tableOfContents,
        bannerImage: body.bannerImage,
        thumbnailImage: body.thumbnailImage,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        metaKeywords: body.metaKeywords,
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

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromHeaders();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const blogId = parseInt(id);

    const existingBlog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    if (existingBlog.authorId !== user.id) {
      return NextResponse.json(
        { success: false, error: "You can only delete your own blogs" },
        { status: 403 }
      );
    }

    await prisma.blog.delete({
      where: { id: blogId },
    });

    return NextResponse.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
