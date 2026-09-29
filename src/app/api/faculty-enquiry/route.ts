import { NextRequest, NextResponse } from 'next/server';
import { createFacultyEnquiry } from '@/services/faculty-enquiry.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, resume, availableDate } = body;

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
      message: message?.trim() || null,
      resume: resume || null,
      availableDate: availableDate ? new Date(availableDate) : null,
    };

    const newEnquiry = await createFacultyEnquiry(enquiryData);

    return NextResponse.json({
      success: true,
      data: newEnquiry,
      message: 'Application submitted successfully. Our HR team will contact you soon.',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating faculty enquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to submit application. Please try again.',
    }, { status: 500 });
  }
}
