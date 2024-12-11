import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import User from '../../models/UserSchema';
import connect from '../../lib/connect';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  try {
    await connect(); // Ensure the database connection is established
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection error:', error);
    return new Response('Database connection error', { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  try {
    const payload = await req.json();
    console.log('Payload:', payload); // Log the payload to debug
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
      console.log('Verified event:', evt); // Log the verified event to debug
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error occurred', {
        status: 400,
      });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    if (!id) {
      console.error('No Clerk user ID found in event data');
      return new Response('No Clerk user ID found in event data', {
        status: 400,
      });
    }

    console.log('Clerk user ID:', id); // Log the Clerk user ID to debug

    if (eventType === 'user.created') {
      const { email_addresses } = evt.data;
      console.log('Email addresses:', email_addresses); // Log email addresses to debug

      try {
        // Check if the user already exists
        const existingUser = await User.findOne({ clerkUserId: id });
        console.log('Existing user:', existingUser); // Log existing user to debug

        if (!existingUser) {
          // Create a new user if they don't exist
          const newUser = {
            clerkUserId: id,
            emailAddress: email_addresses[0].email_address,
            isPro: false,
            accumulatedWords: 0,
          };

          const createdUser = await User.create(newUser);
          console.log('User created and saved to database:', createdUser);
          console.log('MongoDB User ID:', createdUser._id); // Log the MongoDB user ID
        } else {
          // If the user already exists, you can decide what to do here.
          console.log('User already exists:', existingUser);
        }
      } catch (error) {
        console.error('Error handling user in database:', error);
      }
    } else if (eventType === 'user.deleted') {
      console.log(`User with ID ${id} was deleted.`);
    } else {
      console.log(`Unhandled event type: ${eventType}`);
    }
    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    console.log('Webhook body:', body);

    return new Response('', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}
