import { generateId } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

import { UIMessage } from 'ai';

import { Error_ChatNotFound } from './custom_errors/chat_errors';

function getChatFileLocation(id: string): string {
    const chatDir = path.join(process.cwd(), '.CHATS');
    if (!existsSync(chatDir))
        mkdirSync(chatDir, { recursive: true });
    return path.join(chatDir, `${id}.json`);
}

export async function createChat(): Promise<string> {
    const id = generateId(); // generate a unique chat ID
    await writeFile(getChatFileLocation(id), '[]'); // create an empty chat file
    return id;
}

export async function loadChat(id: string): Promise<UIMessage[]> {
    try {
        return JSON.parse(await readFile(getChatFileLocation(id), 'utf8'));
    } catch (error: Error | any) {
        if (error.code === 'ENOENT') {
            // throw error;
            throw new Error_ChatNotFound(id);
        }
        return [];
    }
}

export async function saveChat({
    chatId,
    messages,
}: {
    chatId: string;
    messages: UIMessage[];
}): Promise<void> {
    const content = JSON.stringify(messages, null, 2);
    await writeFile(getChatFileLocation(chatId), content);
}