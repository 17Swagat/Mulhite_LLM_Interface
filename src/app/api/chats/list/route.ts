import { NextResponse } from 'next/server';
import { getLocalChatFileNames } from '@/utils/chat-store';

export async function GET() {
  try {
    const chatIds = getLocalChatFileNames();
    return NextResponse.json({ chatIds });
  } catch (error) {
    console.error('Error fetching chat list:', error);
    return NextResponse.json({ chatIds: [] });
  }
}
