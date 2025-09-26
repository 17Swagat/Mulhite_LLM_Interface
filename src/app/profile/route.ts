import {NextRequest } from "next/server";
import { headers } from "next/headers";

export async function GET(request: NextRequest){
    const headersList = await headers();
    console.log(headersList.get('Authorization'))

    // To read the cookie in the route-handler
    const theme = request.cookies.get('theme')
    console.log(theme)

    return new Response('<h1> Profile API data </h1>', {headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Set-Cookie': ['theme=dark', 'version=1'].join(', ')
    }})
}