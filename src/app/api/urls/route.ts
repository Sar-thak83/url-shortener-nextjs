import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/models/Url';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { generateShortCode, isValidUrl } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { originalUrl, customShortCode, expiresAt } = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return NextResponse.json(
        { success: false, message: 'Valid URL is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    let shortCode = customShortCode || generateShortCode();
    
    const existingUrl = await Url.findOne({ shortCode });
    if (existingUrl) {
      if (customShortCode) {
        return NextResponse.json(
          { success: false, message: 'Custom short code already exists' },
          { status: 400 }
        );
      } else {
        shortCode = generateShortCode();
      }
    }

    const url = await Url.create({
      originalUrl,
      shortCode,
      customDomain: user.customDomain,
      userId: decoded.userId,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    return NextResponse.json({
      success: true,
      message: 'URL shortened successfully',
      url,
    });
  } catch (error) {
    console.error('URL creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const urls = await Url.find({ userId: decoded.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      urls,
    });
  } catch (error) {
    console.error('URLs fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}