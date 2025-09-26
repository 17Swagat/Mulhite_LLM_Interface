// Task: Let's Make a Middleware that redirects a user to the home page when he goes to the /profile URL

// NOTE: 
// "1 middleware file per Project."

import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest){
    return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
    matcher: "/profile"
}
