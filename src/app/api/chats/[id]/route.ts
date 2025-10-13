import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chatDir = path.join(process.cwd(), '.CHATS');
    const filePath = path.join(chatDir, `${id}.json`);

    if (existsSync(filePath)) {
      await unlink(filePath);
      return NextResponse.json({ success: true, message: 'Chat deleted' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete chat' },
      { status: 500 }
    );
  }
}
