// import { NextResponse, NextRequest } from 'next/server';
// import { generateId } from 'ai'; // Import directly—Edge-compatible

// export async function middleware(request: NextRequest) {
//     const chatId = generateId(); // Generate ID synchronously (no file I/O needed here)
//     return NextResponse.redirect(new URL(`/chat/${chatId}`, request.url));
// }

// export const config = {
//     matcher: '/chat',
// };