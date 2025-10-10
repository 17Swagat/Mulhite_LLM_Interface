// DeepSeek V1:
import { NextRequest, NextResponse } from 'next/server';
import { loadChat } from '@/utils/chat-store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = await loadChat(id);
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json(
      { error: 'Chat not found' },
      { status: 404 }
    );
  }
}