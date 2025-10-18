import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel"; // ✅ correct import
import { api } from "./_generated/api";
import { userInfo } from "os";
import { paginationOptsValidator } from "convex/server";

async function getCurrentUserQuery(ctx: QueryCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
        throw new Error("Unauthorized");

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
        .first();

    if (!user) {
        // Return null instead of throwing - queries can't create users
        return null;
    }
    return user;
}

async function getCurrentUserMutation(ctx: MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthorized");
    }

    let user = await ctx.db
        .query("users")
        .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
        .first();

    // Auto-create user if doesn't exist (only in mutations)
    if (!user) {
        const userId = await ctx.db.insert("users", {
            clerkUserId: identity.subject,
            email: identity.email || "",
            name: identity.name || undefined,
        });
        user = (await ctx.db.get(userId)) as any;
        if (!user)
            throw new Error("Failed to create user");
    }

    return user;
}

async function ensureUserOwnsConvoQuery(
    ctx: QueryCtx,
    { conversationId }: { conversationId: Id<"conversations"> }
) {
    const user = await getCurrentUserQuery(ctx);
    if (!user) return null;

    try {
        const convo = await ctx.db.get<"conversations">(conversationId);
        if (!convo) return null;
        if (convo.userId !== user._id) throw new Error("Unauthorized");
        return convo;
    } catch (error) {
        return null;
    }
}

async function ensureUserOwnsConvoMutation(
    ctx: MutationCtx,
    { conversationId }: { conversationId: Id<"conversations"> }
) {
    const user = await getCurrentUserMutation(ctx);
    const convo = await ctx.db.get<"conversations">(conversationId);
    if (!convo || convo.userId !== user._id) throw new Error("Unauthorized");
}

export const listConversations = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUserQuery(ctx);
        // If user doesn't exist yet, return empty array
        // User will be created on first mutation (create conversation)
        if (!user)
            return [];

        return await ctx.db
            .query("conversations")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();
    },
});


export const listConversationsPaginate = query({
    args: {
        paginationOpts: paginationOptsValidator,
        doReset: v.boolean()
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserQuery(ctx);
        if (!user) {
            return {
                page: [],
                isDone: true,
                continueCursor: "",
            };
        }
        const results = await ctx.db
            .query('conversations')
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .order('desc')
            .paginate(args.paginationOpts)
        return results;
    }
})


export const getMessages = query({
    args: {
        conversationId: v.string(),
        limit: v.optional(v.number()),
        cursor: v.optional(v.string()),
    },
    handler: async (ctx, { conversationId, limit = 50, cursor }) => {
        // Validate ID format
        const validIdRegex = /^[a-z0-9]+$/i;
        if (!validIdRegex.test(conversationId) || conversationId.length < 10) {
            return { messages: [], nextCursor: null, notFound: true };
        }

        const convo = await ensureUserOwnsConvoQuery(ctx, { conversationId: conversationId as Id<"conversations"> });

        if (!convo) {
            return { messages: [], nextCursor: null, notFound: true };
        }

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) =>
                q.eq("conversationId", conversationId as Id<"conversations">)
            )
            .order("asc")
            .paginate({ cursor: cursor ?? null, numItems: limit });

        return {
            messages: messages.page,
            nextCursor: messages.continueCursor,
            notFound: false
        };
    },
});


export const createConversation = mutation({
    args: {
        title: v.optional(v.string())
    },
    handler: async (ctx, { title }) => {
        const user = await getCurrentUserMutation(ctx);
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
    },
    handler: async (ctx, args) => {
        await ensureUserOwnsConvoMutation(ctx, { conversationId: args.conversationId });
        const now = Date.now();

        const messageId = await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            role: args.role,
            parts: args.parts,
            timestamp: now,
        });

        await ctx.db.patch(args.conversationId, { updatedAt: now });
        return { _id: messageId };
    },
});

export const updateConversation = mutation({
    args: {
        conversationId: v.id("conversations"),
        title: v.string(),
    },
    handler: async (ctx, { conversationId, title }) => {
        await ensureUserOwnsConvoMutation(ctx, { conversationId });

        await ctx.db.patch(conversationId, {
            title,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

export const deleteConversation = mutation({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, { conversationId }) => {
        await ensureUserOwnsConvoMutation(ctx, { conversationId });

        // Delete all messages in this conversation
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) =>
                q.eq("conversationId", conversationId)
            )
            .collect();

        for (const message of messages) {
            await ctx.db.delete(message._id);
        }

        // Delete the conversation
        await ctx.db.delete(conversationId);

        return { success: true };
    },
});

// Ensure user exists - call this on app initialization
export const ensureUser = mutation({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUserMutation(ctx);
        return { userId: user._id };
    },
});

