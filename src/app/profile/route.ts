import {NextRequest } from "next/server";
import { headers } from "next/headers";

export async function GET(request: NextRequest){
    // Way #1
    // const requestHeaders = new Headers(request.headers) 
    // console.log(requestHeaders.get('Authorization'))

    // Way #2
    /*<Handling headers from a INCOMING REQUEST> */
    const headersList = await headers();
    /*NOTE: "Headers returned from the `headers()` function is READONLY." */
    console.log(headersList.get('Authorization'))
    return new Response('Profile API data')
}