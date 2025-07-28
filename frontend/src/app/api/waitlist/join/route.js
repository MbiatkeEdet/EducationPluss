import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, socialHandle, socialPlatform, referralCode } = await request.json();

    // Validate input
    if (!email || !socialHandle || !socialPlatform) {
      return NextResponse.json(
        { success: false, message: 'Email, social handle, and platform are required' },
        { status: 400 }
      );
    }

    // Call backend API directly
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL || 'http://localhost:3001'}/api/waitlist/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        socialHandle,
        socialPlatform,
        referralCode: referralCode || undefined, // Don't send empty string
      }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to join waitlist' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      data: {
        position: data.data.position,
        referralCode: data.data.referralCode,
        referralBonus: data.data.referralBonus || 0,
      },
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}