import { NextResponse } from 'next/server';
import { createBlog, getAllBlogs } from '@/services/blog.service';


export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      categoryId: searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')) : undefined,
      authorId: searchParams.get('authorId') ? searchParams.get('authorId') : undefined,
      isPublic: searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined,
      isFeatured: searchParams.get('isFeatured') ? searchParams.get('isFeatured') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 50,
    };

    const blogs = await getAllBlogs(filters);
    
    return NextResponse.json({
      success: true,
      data: blogs,
      count: blogs.length,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch blogs',
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newBlog = await createBlog(body);
    
    return NextResponse.json({
      success: true,
      data: newBlog,
      message: 'Blog created successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create blog',
    }, { status: 400 });
  }
}