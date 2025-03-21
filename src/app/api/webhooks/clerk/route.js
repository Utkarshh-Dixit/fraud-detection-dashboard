import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const payload = await req.json();
  const headerPayload = headers();
  
  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id'),
    'svix-timestamp': headerPayload.get('svix-timestamp'),
    'svix-signature': headerPayload.get('svix-signature')
  };

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(JSON.stringify(payload), svixHeaders);
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }

  const { id, email_addresses, public_metadata } = evt.data;
  
  if (evt.type === 'user.created') {
    await prisma.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0].email_address,
        role: public_metadata.role || 'Analyst'
      }
    });
  }

  return new Response('', { status: 200 });
}