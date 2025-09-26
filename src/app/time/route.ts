export const dynamic = "force-static";

// Implement Incremental Static Regeneration (ISR):=>
// Next.js will invalidate the cache when a
// request comes in, at most once every 10 seconds.
export const revalidate = 10;

// NOTE: "Caching only works with GET Methods. Other HTTP methods like PUT, PATCH or DELETE are never cached."

export async function GET(){
    return Response.json({
        time: new Date().toLocaleTimeString()
    });
}