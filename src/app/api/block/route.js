import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Get Clerk user ID
    const { userId, orgId, sessionClaims } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - No user session' }, 
        { status: 401 }
      );
    }

    // Verify user role if needed
    const userRole = sessionClaims?.publicMetadata?.role;
    if (!userRole || userRole !== 'Admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Insufficient privileges' }, 
        { status: 403 }
      );
    }

    const { entityId } = await req.json();

    // Create blocked entity with Clerk user ID
    const blockedEntity = await prisma.blockedEntity.create({
      data: { 
        entityId, 
        blockedBy: userId 
      }
    });

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