import { NextResponse } from 'next/server';
import { getBlogById, updateBlog, deleteBlog } from '@/services/blog.service';


export async function GET(request, { params }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid blog ID',
      }, { status: 400 });
    }

    const blog = await getBlogById(id);
    
    if (!blog) {
      return NextResponse.json({
        success: false,
        error: 'Blog not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: blog,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch blog',
    }, { status: 500 });
  }
}


export async function PUT(request, { params }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid blog ID',
      }, { status: 400 });
    }

    const body = await request.json();
    if (body.dateOfPublish && typeof body.dateOfPublish === 'string') {
      body.dateOfPublish = new Date(body.dateOfPublish);
    }
    
    const updatedBlog = await updateBlog(id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedBlog,
      message: 'Blog updated successfully',
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update blog',
    }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid blog ID',
      }, { status: 400 });
    }

    await deleteBlog(id);
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete blog',
    }, { status: 400 });
  }
}