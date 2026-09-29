import { NextResponse } from 'next/server';
import { createBlog, getAllBlogs } from '@/services/blog.service';
import { getUserFromHeaders } from '@/lib/request-user';

export async function GET(request: Request) {
  try {
    const user = await getUserFromHeaders();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    const filters = {
      categoryId: searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined,
      authorId: user.id,
      isPublic: searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined,
      isFeatured: searchParams.get('isFeatured') ? searchParams.get('isFeatured') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    };

    const blogs = await getAllBlogs(filters);
    
    return NextResponse.json({
      success: true,
      data: blogs,
      count: blogs.length,
    }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blogs';
    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromHeaders();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const body = await request.json();
    
    const blogData = {
      title: body.title,
      description: body.description,
      content: body.content,
      categoryId: body.categoryId,
      slug: body.slug,
      authorId: user.id,
      bannerImage: body.bannerImage,
      thumbnailImage: body.thumbnailImage,
      dateOfPublish: new Date(), // Force today's date
      readTime: body.readTime || 5,
      tags: body.tags,
      tableOfContents: body.tableOfContents,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      metaKeywords: body.metaKeywords,
    };

    const newBlog = await createBlog(blogData);
    
    return NextResponse.json({
      success: true,
      data: newBlog,
      message: 'Blog created successfully',
    }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create blog';
    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 400 });
  }
}
