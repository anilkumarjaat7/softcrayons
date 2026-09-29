import { NextRequest, NextResponse } from 'next/server';
import { createEnterpriseEnquiry } from '@/services/enterprise-enquiry.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, email, phone, duration, message } = body;

    if (!companyName || !email || !phone) {
      return NextResponse.json({
        success: false,
        error: 'Company name, email, and phone are required fields.',
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
      companyName: companyName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      duration: duration?.trim() || null,
      message: message?.trim() || null,
    };

    const newEnquiry = await createEnterpriseEnquiry(enquiryData);

    return NextResponse.json({
      success: true,
      data: newEnquiry,
      message: 'Enterprise enquiry submitted successfully. Our team will contact you within 24-48 hours.',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating enterprise enquiry:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to submit enquiry. Please try again.',
    }, { status: 500 });
  }
}
