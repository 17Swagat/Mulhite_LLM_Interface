//////////////////////////////////////////////////////////

// import { generateId } from 'ai';

// import fs from 'fs';
// import { writeFile, readFile } from 'fs/promises';
// import path from 'path';

// import { UIMessage } from 'ai';

// import { Error_ChatNotFound } from './custom_errors/chat_errors';

// function getChatFileLocation(id: string): string {
//     const chatDir = path.join(process.cwd(), '.CHATS');
//     if (!fs.existsSync(chatDir)) {
//         fs.mkdirSync(chatDir, { recursive: true });
//     }
//     return path.join(chatDir, `${id}.json`);
// }

// export async function createNewChat(id: string) {
     
// }

// export async function createChat(): Promise<string> {
//     const id = generateId(); // generate a unique chat ID
//     await writeFile(getChatFileLocation(id), '[]'); // create an empty chat file
//     return id;
// }

// export async function loadChat(id: string): Promise<UIMessage[]> {
//     const filePath = getChatFileLocation(id);
//     try {
//         const content = await readFile(filePath, 'utf8');
//         return JSON.parse(content);
//     } catch (error: any) {
//         if (error.code === 'ENOENT') {
//             // File doesn't exist: throw error instead of creating
//             throw new Error_ChatNotFound(id);
//         }
//         throw error; // Re-throw other errors (e.g., JSON parse errors)
//     }
// }

// export async function saveChat({
//     chatId,
//     messages,
// }: {
//     chatId: string;
//     messages: UIMessage[];
// }): Promise<void> {
//     const content = JSON.stringify(messages, null, 2);
//     await writeFile(getChatFileLocation(chatId), content);
// }

// export function getChatHistory(): UIMessage[] {
//     const folderPath = path.join(process.cwd(), '.CHATS');
//     const result: UIMessage[] = [];
//     const files = fs.readdirSync(folderPath);

//     for (const file of files) {
//         const fullPath = path.join(folderPath, file);

//         if (path.extname(file) === '.json') {
//             try {
//                 const fileContent = fs.readFileSync(fullPath, 'utf-8');
//                 const jsonArray: unknown = JSON.parse(fileContent);

//                 if (Array.isArray(jsonArray) && jsonArray.length > 0 && typeof jsonArray[0] === 'object') {
//                     result.push(jsonArray[0] as UIMessage);
//                 }
//             } catch (err) {
//                 console.error(`Error processing ${file}:`, (err as Error).message);
//             }
//         }
//     }

//     return result;
// }

// export function getLocalChatFileNames() {
//     // function to return file names in .CHATS folder
//     const folderPath = path.join(process.cwd(), '.CHATS');
//     const result: any = [];
//     const files = fs.readdirSync(folderPath);

//     for (const file of files) {
//         const fullPath = path.join(folderPath, file);

//         if (path.extname(file) === '.json') {
//             try {
//                 result.push(path.basename(file, '.json'));
//             } catch (err) {
//                 console.error(`Error processing ${file}:`, (err as Error).message);
//             }
//         }
//     }

//     return result;
// }




//////////////////////////////////////////////////////////////////////
// import { generateId } from 'ai';

// import fs from 'fs';
// import { writeFile, readFile } from 'fs/promises';
// import path from 'path';

// import { UIMessage } from 'ai';

// import { Error_ChatNotFound } from './custom_errors/chat_errors';

// function getChatFileLocation(id: string): string {
//     const chatDir = path.join(process.cwd(), '.CHATS');
//     if (!fs.existsSync(chatDir)) { // Sync check is fine here (runs in Node.js context)
//         fs.mkdirSync(chatDir, { recursive: true });
//     }
//     return path.join(chatDir, `${id}.json`);
// }

// export async function createChat(): Promise<string> {
//     const id = generateId(); // generate a unique chat ID
//     await writeFile(getChatFileLocation(id), '[]'); // create an empty chat file
//     return id;
// }

// export async function loadChat(id: string): Promise<UIMessage[]> {
//     const filePath = getChatFileLocation(id);
//     try {
//         const content = await readFile(filePath, 'utf8');
//         return JSON.parse(content);
//     } catch (error: any) {
//         if (error.code === 'ENOENT') {
//             // Lazy creation for new chats: Create empty file and return []
//             await writeFile(filePath, '[]');
//             return [];
//         }
//         // For other errors, re-throw or handle as needed (e.g., throw new Error_ChatNotFound(id);)
//         if (error.code !== 'ENOENT') {
//             throw new Error_ChatNotFound(id);
//         }
//         return []; // Fallback
//     }
// }

// export async function saveChat({
//     chatId,
//     messages,
// }: {
//     chatId: string;
//     messages: UIMessage[];
// }): Promise<void> {
//     const content = JSON.stringify(messages, null, 2);
//     await writeFile(getChatFileLocation(chatId), content);
// }

// export function getChatHistory(): UIMessage[] {
//     const folderPath = path.join(process.cwd(), '.CHATS');
//     const result: UIMessage[] = [];
//     const files = fs.readdirSync(folderPath);

//     for (const file of files) {
//         const fullPath = path.join(folderPath, file);

//         if (path.extname(file) === '.json') {
//             try {
//                 const fileContent = fs.readFileSync(fullPath, 'utf-8');
//                 const jsonArray: unknown = JSON.parse(fileContent);

//                 if (Array.isArray(jsonArray) && jsonArray.length > 0 && typeof jsonArray[0] === 'object') {
//                     result.push(jsonArray[0] as UIMessage);
//                 }
//             } catch (err) {
//                 console.error(`Error processing ${file}:`, (err as Error).message);
//             }
//         }
//     }

//     return result;
// }

// export function getLocalChatFileNames() {
//     // function to return file names in .CHATS folder

//     const folderPath = path.join(process.cwd(), '.CHATS');
//     const result: any = [];
//     const files = fs.readdirSync(folderPath);

//     for (const file of files) {
//         const fullPath = path.join(folderPath, file);

//         if (path.extname(file) === '.json') {
//             try {
//                 // console.log(file);
//                 result.push(path.basename(file, '.json'));
//             } catch (err) {
//                 console.error(`Error processing ${file}:`, (err as Error).message);
//             }
//         }
//     }

//     return result;
// }



///////////////////////////////////////////////////////////

import { generateId } from 'ai';

import fs from 'fs';
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


// type JsonObject = Record<string, any>;
// export function getChatHistory(): JsonObject[] {
export function getChatHistory(): UIMessage[] {

    const folderPath = path.join(process.cwd(), '.CHATS');
    const result: UIMessage[] = [];
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const fullPath = path.join(folderPath, file);

        if (path.extname(file) === '.json') {
            try {
                const fileContent = fs.readFileSync(fullPath, 'utf-8');
                const jsonArray: unknown = JSON.parse(fileContent);

                if (Array.isArray(jsonArray) && jsonArray.length > 0 && typeof jsonArray[0] === 'object') {
                    

                    result.push(jsonArray[0] as UIMessage);
                }
            } catch (err) {
                console.error(`Error processing ${file}:`, (err as Error).message);
            }
        }
    }

    return result;
}

export function getLocalChatFileNames() {
    // function to return file names in .CHATS folder

    const folderPath = path.join(process.cwd(), '.CHATS');
    const result:any  = [];
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const fullPath = path.join(folderPath, file);

        if (path.extname(file) === '.json') {
            try {
                // console.log(file);
                result.push(path.basename(file, '.json'))
            } catch (err) {
                console.error(`Error processing ${file}:`, (err as Error).message);
            }
        }
    }

    return result;
}
