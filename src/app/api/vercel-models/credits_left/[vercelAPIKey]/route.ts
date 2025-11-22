import { NextRequest, NextResponse } from "next/server";
// import { gateway } from "ai";

export async function GET(request: Request,
    { params }: { params: Promise<{ vercelAPIKey: string }> }
) {

    const { vercelAPIKey } = await params;

    try {
        // 💵 Vercel MODEL CREDITS
        // #M1: Uses the provided `AI_GATEWAY_API_KEY` from the .env file, not useful for client-specific keys.
        // const credits = await gateway.getCredits();

        // #M2: Direct Fetch Call with API Key from request headers or other secure storage
        // NOTE: Docs=> https://vercel.com/docs/ai-gateway/usage#credits
        // const temp_api_key = 'vck_6lkNZlV5Zc1KGBU0OmiVLBiXIPJyM36bciFotDKsrsHvELFnMH06DDv6'

        const response = await fetch('https://ai-gateway.vercel.sh/v1/credits', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${vercelAPIKey}`,
                'Content-Type': 'application/json',
            },
        });

        const credits = await response.json();
        const credits_left = credits.balance; // The remaining gateway credit balance available for API usage
        const credits_totalConsumed = credits.totalUsed; // The total amount of gateway credits that have been consumed

        return NextResponse.json({
            creditsLeft: credits_left,
            creditsTotalConsumed: credits_totalConsumed
        });

    } catch (error) {
        // console.log(error)
        return NextResponse.json(
            { creditsLeft: 0, creditsTotalConsumed: 0 }
            // { error: "Failed to fetch credits" }, { status: 500 }
        );
    }
}