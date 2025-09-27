// Approach 01: Using Config Object
// Approach 02: Using Conditions

// Task: Use of [cookies] & [headers] in Middleware.

import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest){
    const response = NextResponse.next();
    const themePreference = request.cookies.get('theme')
    if (!themePreference) {
        response.cookies.set('theme', 'dark')
    }
    // Setting Up Header
    response.headers.set('Custom-Header', 'custom-value')
    
    return response;
}