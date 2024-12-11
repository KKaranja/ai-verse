// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/app/lib/connect';
import User from '@/app/models/UserSchema';
import { NextResponse } from 'next/server';

import { json } from 'body-parser';

export async function POST(req: Request) {
  try {
    await connect(); // Ensure the database connection is established
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Database connection error' },
      { status: 500 }
    );
  }

  try {
    // Extract the correct properties from the request body
    const { clerkUserId, emailAddress } = await req.json();
    console.log('Received data:', { clerkUserId, emailAddress });

    // Simple validation
    if (!clerkUserId || !emailAddress) {
      return NextResponse.json(
        { error: 'clerkUserId and emailAddress are required' },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ clerkUserId });
    console.log('Existing user:', existingUser);

    if (!existingUser) {
      const newUser = {
        clerkUserId,
        emailAddress,
        isPro: false,
        accumulatedWords: 0,
      };
      console.log('newUser', newUser);

      try {
        const createdUser = await User.create(newUser);
        console.log('User created and saved to database:', createdUser);
        return NextResponse.json(
          { message: 'User created successfully', createdUser },
          { status: 201 }
        );
      } catch (createError) {
        console.error('Error creating user in database:', createError);
        return NextResponse.json(
          { error: 'Failed to create user in database', details: createError },
          { status: 500 }
        );
      }
    } else {
      console.log('User already exists:', existingUser);
      return NextResponse.json(
        { message: 'User already exists', existingUser },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error handling user in database:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error },
      { status: 500 }
    );
  }
}

// GET Method: Retrieve user properties (isPro, accumulatedWords) based on user id
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  // Validate if userId is provided
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await connect();
    const user = await User.findOne({ clerkUserId: userId }).select(
      'isPro accumulatedWords'
    );

    // If user not found
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user's isPro and accumulatedWords fields
    return NextResponse.json(
      {
        isPro: user.isPro,
        accumulatedWords: user.accumulatedWords,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user data', details: error },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { id, isPro, accumulatedWords } = await req.json(); // Fields to update

  // Simple validation
  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  console.log('accumulated words', accumulatedWords);

  try {
    await connect();
    // Find the user by ID and update the fields
    const updatedUser = await User.findOneAndUpdate(
      { clerkUserId: id },
      { isPro: isPro, accumulatedWords: accumulatedWords },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'User updated successfully',
      updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user', details: error },
      { status: 500 }
    );
  }
}
