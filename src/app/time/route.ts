export const dynamic = "force-static";

// "NOTE: There is no caching during development. So, during development on refreshing/reload the [Browser] on this URL, we will see the new time on each reload"

// "In order to visually see the caching happening. We will have to build the Project and go to this route in order to see the caching happening."
// "pnpm build"

export async function GET(){
    return Response.json({
        time: new Date().toLocaleTimeString()
    });
}