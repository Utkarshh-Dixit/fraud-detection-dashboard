import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import BlockedEntity from '@/models/BlockedEntity';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req) {
  try {
    await connectToDB();
    
    // Get Clerk authentication
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    // Process request data
    const payload = await req.json();
    const existingEntity = await BlockedEntity.findOne({
      entityId: payload.entityId
    });

    if (existingEntity) {
      return NextResponse.json(
        { error: 'This entity is already blocked' },
        { status: 409 }
      );
    }

    // Create new blocked entity
    const newEntity = new BlockedEntity({
      ...payload,
      blockedBy: userId
    });

    const savedEntity = await newEntity.save();
    return NextResponse.json(savedEntity, { status: 201 });

  } catch (error) {
    console.error('Block error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}