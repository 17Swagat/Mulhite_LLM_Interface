export const dynamic = "force-static";

// Implement Incremental Static Regeneration (ISR):=>
// Next.js will invalidate the cache when a
// request comes in, at most once every 10 seconds.
export const revalidate = 10;

// NOTE: "Caching only works with GET Methods. Other HTTP methods like PUT, PATCH or DELETE are never cached."

// "If you're working using dynamic functions like `headers()` and `cookies()`, or working with the Request Object in your GET Method, caching won't be applied"

export async function GET(){
    return Response.json({
        time: new Date().toLocaleTimeString()
    });
}