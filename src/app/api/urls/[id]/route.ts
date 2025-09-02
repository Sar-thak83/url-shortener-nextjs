import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/models/Url';
import { verifyToken } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const url = await Url.findOneAndDelete({
      _id: params.id,
      userId: decoded.userId,
    });

    if (!url) {
      return NextResponse.json(
        { success: false, message: 'URL not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'URL deleted successfully',
    });
  } catch (error) {
    console.error('URL deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}