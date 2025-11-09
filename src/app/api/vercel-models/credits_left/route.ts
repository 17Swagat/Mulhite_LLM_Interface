import { NextRequest, NextResponse } from "next/server";
import { gateway } from "ai";

export async function GET(request: NextRequest) {

    // 💵 Vercel MODEL CREDITS
    const credits = await gateway.getCredits();
    const credits_left = credits.balance; // The remaining gateway credit balance available for API usage
    const credits_totalConsumed = credits.totalUsed; // The total amount of gateway credits that have been consumed

    return NextResponse.json({
        creditsLeft: credits_left,
        creditsTotalConsumed: credits_totalConsumed
    });
}