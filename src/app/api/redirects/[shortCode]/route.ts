import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/models/Url';

export async function GET(
  request: Request,
  { params }: { params: { shortCode: string } }
) {
  try {
    await connectDB();

    const url = await Url.findOne({ shortCode: params.shortCode });

    if (!url) {
      return NextResponse.json(
        { success: false, message: 'URL not found' },
        { status: 404 }
      );
    }

    if (url.expiresAt && new Date() > url.expiresAt) {
      return NextResponse.json(
        { success: false, message: 'URL has expired' },
        { status: 410 }
      );
    }

    await Url.findByIdAndUpdate(url._id, { $inc: { clicks: 1 } });

    return NextResponse.redirect(url.originalUrl, 301);
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}