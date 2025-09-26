// Task: Let's Make a Middleware that redirects a user to the home page when he goes to the /profile URL

// NOTE: 
// "1 middleware file per Project."

// Approach 01: Using Config Object
// Approach 02: Using Conditions

import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest){
    // Adding Multiple Routes :
    if (['/profile', '/time2'].includes(request.nextUrl.pathname)){
        // return NextResponse.redirect(new URL('/', request.url))
        return NextResponse.rewrite(new URL('/dashboard', request.url))
    }
}