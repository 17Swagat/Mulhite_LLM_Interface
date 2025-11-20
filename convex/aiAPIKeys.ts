import { v } from "convex/values";
import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";

async function getCurrentUserQuery(ctx: QueryCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db.query("users").withIndex("by_clerkUserId", (q) =>
        q.eq("clerkUserId", identity.subject)
    ).first();

    if (!user) return null;

    return user;
}

async function getCurrentUserMutation(ctx: MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        // console.warn("No user identity found; possible session issue");
        // throw new Error("Unauthorized");
        return null;
    }

    let user = await ctx.db
        .query("users")
        .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
        .first();

    if (!user) return null;

    // Auto-create user if doesn't exist (only in mutations)
    /*if (!user) {
        const userId = await ctx.db.insert("users", {
            clerkUserId: identity.subject,
            email: identity.email || "",
            name: identity.name || undefined,
        });
        user = (await ctx.db.get(userId)) as any;
        if (!user)
            throw new Error("Failed to create user");
        // return null;
    }*/

    return user;
}

export const getAIModelAPIKey = query({
    args: {
        providerName: v.union(v.literal('vercel'), v.literal('openrouter')),
    },
    handler: async (ctx, args) => {
        // TODO: Right now only support 'vercel'
        if (args.providerName == 'vercel') {
            const user = await getCurrentUserQuery(ctx);
            if (!user) {
                return null;
            }
            const apiKeys = user.apiKeys || [];
            const vercelKeyObj = apiKeys.find((key) => key.llm === "vercel");
            return vercelKeyObj ? vercelKeyObj.key : null;
        } else {
            return null;
        }
    }
})

export const setAIModelAPIKeyMutation = mutation({
    args: {
        providerName: v.union(v.literal('vercel'), v.literal('openrouter')),
        apiKey: v.string()
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserMutation(ctx);
        if (!user) return;

        await ctx.db.patch(user._id, {
            apiKeys: [
                // ...(user.apiKeys || []).filter((key) => key.llm !== args.providerName),
                {
                    llm: args.providerName,
                    key: args.apiKey
                }
            ]
        })
    }
})

// export function getVercelAIKeyMutation() {
// return mutation({
//     args: {},
//     handler: async (ctx) => {
//         const user = await getCurrentUserQuery(ctx);
//         if (!user) {
//             throw new Error("Unauthorized");
//         }
//         const apiKeys = user.apiKeys || [];
//         const vercelKeyObj = apiKeys.find((key) => key.llm === "vercel");
//         return vercelKeyObj ? vercelKeyObj.key : null;
//     }
// });
// }