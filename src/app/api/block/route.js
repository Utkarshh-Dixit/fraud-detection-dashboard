import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import BlockedEntity from '@/models/BlockedEntity';

export async function POST(req) {
  try {
    await connectToDB();
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const { entityId } = payload;

    const existingEntity = await BlockedEntity.findOne({ entityId });
    if (existingEntity) {
      return NextResponse.json(
        { error: 'Entity already blocked', entity: existingEntity },
        { status: 409 }
      );
    }

    const newEntity = new BlockedEntity({
      ...payload,
      blockedBy: userId
    });
    
    const savedEntity = await newEntity.save();
    return NextResponse.json(savedEntity, { status: 201 });

  } catch (error) {
    console.error('Error blocking entity:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}