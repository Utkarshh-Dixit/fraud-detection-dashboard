import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Get Clerk user
    const user = await currentUser();
    console.log("User: ", user);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - No user session' }, 
        { status: 401 }
      );
    }

    // Verify user role
    const userRole = user.publicMetadata?.role;
    if (userRole !== 'Admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Insufficient privileges' }, 
        { status: 403 }
      );
    }

    const { entityId } = await req.json();

    // Create blocked entity
    const blockedEntity = await prisma.blockedEntity.create({
      data: { 
        entityId, 
        blockedBy: user.id 
      }
    });

    console.log("Blocked Entity: ", blockedEntity);

    return NextResponse.json({ 
      success: true, 
      data: blockedEntity 
    });

  } catch (error) {
    console.error('Error blocking entity:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}