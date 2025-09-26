import {NextRequest } from "next/server";
import { headers } from "next/headers";

export async function GET(request: NextRequest){
    // Way #1
    // const requestHeaders = new Headers(request.headers) 
    // console.log(requestHeaders.get('Authorization'))

    // Way #2
    const headersList = await headers();
    console.log(headersList.get('Authorization'))
    return new Response('Profile API data')
}