import { NextRequest, NextResponse } from 'next/server';
import { createEnquiry } from '@/services/enquiry.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, courseId, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({
        success: false,
        error: 'Name, email, and phone are required fields.',
      }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Please provide a valid email address.',
      }, { status: 400 });
    }

    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json({
        success: false,
        error: 'Please provide a valid phone number.',
      }, { status: 400 });
    }

    const enquiryData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      courseId: courseId ? parseInt(courseId) : null,
      message: message?.trim() || null,
    };

    const newEnquiry = await createEnquiry(enquiryData);

    return NextResponse.json({
      success: true,
      data: newEnquiry,
      message: 'Enquiry submitted successfully. Our team will contact you soon.',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to submit enquiry. Please try again.',
    }, { status: 500 });
  }
}
