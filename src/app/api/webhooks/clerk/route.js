import { Webhook } from 'svix';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const payload = await req.json();
  const headerPayload = req.headers;

  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id'),
    'svix-timestamp': headerPayload.get('svix-timestamp'),
    'svix-signature': headerPayload.get('svix-signature')
  };

  if (!svixHeaders['svix-id'] || !svixHeaders['svix-timestamp'] || !svixHeaders['svix-signature']) {
    return new Response('Missing Svix headers', { status: 400 });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(JSON.stringify(payload), svixHeaders);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  const { id, email_addresses, public_metadata } = evt.data;

  if (!id || !email_addresses || email_addresses.length === 0) {
    return new Response('Invalid payload: Missing required fields', { status: 400 });
  }

  try {
    if (evt.type === 'user.created') {
      await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          role: public_metadata?.role || 'Analyst' // Default role if not provided
        }
      });
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Internal server error', { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}