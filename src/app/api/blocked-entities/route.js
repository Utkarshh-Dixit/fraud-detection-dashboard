import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import BlockedEntity from '@/models/BlockedEntity';

export async function GET() {
  try {
    await connectToDB();
    const entities = await BlockedEntity.find().sort({ createdAt: -1 });
    return NextResponse.json(entities);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}