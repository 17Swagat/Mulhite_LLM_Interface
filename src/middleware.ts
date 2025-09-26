// Task: Let's Make a Middleware that redirects a user to the home page when he goes to the /profile URL

// NOTE: 
// "1 middleware file per Project."

// Approach 01: Using Config Object
// Approach 02: Using Conditions

import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest){
    if (request.nextUrl.pathname == '/profile') {
        // console.log(request.url) // 'http://localhost:3000/profile'
        return NextResponse.redirect(new URL('/', request.url))
    }

    // return NextResponse.redirect(new URL('/', request.url))
}

// export const config = {
//     matcher: ["/profile", "/time2"]
// }
