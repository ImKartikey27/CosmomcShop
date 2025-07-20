import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Invite from '@/models/Invite';

const MONGO_URI = process.env.MONGO_DB_URI!;

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  await mongoose.connect(MONGO_URI);
  const invites = await Invite.find({ inviterId: params.userId });

  return NextResponse.json({ count: invites.length, invited: invites });
}
