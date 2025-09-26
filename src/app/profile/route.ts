import {NextRequest } from "next/server";
import { headers } from "next/headers";

export async function GET(request: NextRequest){
    // Way #1
    // const requestHeaders = new Headers(request.headers) 
    // console.log(requestHeaders.get('Authorization'))

    // Way #2
    // Setting Outgoing Headers|:|==>
    const headersList = await headers();
    console.log(headersList.get('Authorization'))
    return new Response('<h1> Profile API data </h1>', {headers: {
        'content-type': 'text/html; charset=utf-8'
    }})
}