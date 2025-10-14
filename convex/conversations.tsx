import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel"; // ✅ correct import
import { api } from "./_generated/api";

async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
        .first();

    if (!user) throw new Error("User not found");
    return user;
}

async function ensureUserOwnsConvo(
    ctx: QueryCtx | MutationCtx,
    { conversationId }: { conversationId: Id<"conversations"> }
) {
    const user = await getCurrentUser(ctx);
    const convo = await ctx.db.get<"conversations">(conversationId); // ✅ fixed
    if (!convo || convo.userId !== user._id) throw new Error("Unauthorized");
}

export const listConversations = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUser(ctx);
        return await ctx.db
            .query("conversations")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();
    },
});

export const getMessages = query({
    args: {
        conversationId: v.id("conversations"),
        limit: v.optional(v.number()),
        cursor: v.optional(v.string()),
    },
    handler: async (ctx, { conversationId, limit = 50, cursor }) => {
        await ensureUserOwnsConvo(ctx, { conversationId });

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) =>
                q.eq("conversationId", conversationId)
            )
            .order("asc")
            .paginate({ cursor: cursor ?? null, numItems: limit }); // ✅ fixed

        return { messages: messages.page, nextCursor: messages.continueCursor };
    },
});

export const createConversation = mutation({
    args: { title: v.optional(v.string()) },
    handler: async (ctx, { title }) => {
        const user = await getCurrentUser(ctx);
        const now = Date.now();
        const convoId = await ctx.db.insert("conversations", {
            userId: user._id,
            title,
            createdAt: now,
            updatedAt: now,
        });
        return { _id: convoId };
    },
});

export const addMessage = mutation({
    args: {
        conversationId: v.id("conversations"),
        role: v.union(v.literal("user"), v.literal("assistant")),
        parts: v.array(
            v.object({
                type: v.string(),
                text: v.optional(v.string()),
            })
        ),
        metadata: v.optional(v.object({})),
    },
    handler: async (ctx, args) => {
        await ensureUserOwnsConvo(ctx, { conversationId: args.conversationId });
        const now = Date.now();

        const messageId = await ctx.db.insert("messages", {
            ...args,
            timestamp: now,
        });

        await ctx.db.patch(args.conversationId, { updatedAt: now });
        return { _id: messageId };
    },
});

