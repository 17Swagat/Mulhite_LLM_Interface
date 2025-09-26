import {NextRequest } from "next/server";
import { headers } from "next/headers";
import { cookies } from "next/headers";

export async function GET(request: NextRequest){
    const headersList = await headers();
    console.log(headersList.get('Authorization'))

    // To read the cookie in the route-handler
    // #Way 1
    // const theme = request.cookies.get('theme')
    // console.log(theme)
    
    // #Way 2
    // NextJS's cookies() funciton
    // "Setting Up Cookie"
    const cookieStore = await cookies()
    cookieStore.set('resultsPerPage', '20')

    return new Response('<h1> Profile API data </h1>', {headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Set-Cookie': 'theme=dark'
        // 'Set-Cookie': ['theme=dark', 'version=1'].join(', ')
    }})
}