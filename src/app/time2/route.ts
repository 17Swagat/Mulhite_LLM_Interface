// Turning "OFF" caching in order to see whether it actually happens or not:
// export const dynamic = "force-static";

export async function GET(){
    return Response.json({
        time: new Date().toLocaleTimeString()
    });
}