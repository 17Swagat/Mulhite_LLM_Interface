import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Helper to get current user (same pattern as conversations.ts)
async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// Create a highlight
export const createHighlight = mutation({
  args: {
    messageId: v.id("messages"),
    conversationId: v.id("conversations"),
    startOffset: v.number(),
    endOffset: v.number(),
    text: v.string(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    const highlightId = await ctx.db.insert("highlights", {
      messageId: args.messageId,
      conversationId: args.conversationId,
      userId: user._id,
      startOffset: args.startOffset,
      endOffset: args.endOffset,
      text: args.text,
      color: args.color || "yellow",
      createdAt: Date.now(),
    });

    return { _id: highlightId };
  },
});

// Get all highlights for a message
export const getHighlightsByMessage = query({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    return await ctx.db
      .query("highlights")
      .withIndex("by_messageId", (q) => q.eq("messageId", args.messageId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
  },
});



// const isConversationOwnedByUser = query({
//   args: {
//     conversationId: v.optional(v.string()),
//   },
//   handler: async (ctx, { conversationId }) => {
//     const user = await getCurrentUser(ctx);
//     if (!user) return false;

//     // Validate that the ID belongs to the conversations table
//     const normalizedId = ctx.db.normalizeId("conversations", conversationId ?? '');
//     if (normalizedId === null) {
//       // Invalid ID or ID from wrong table
//       return false;
//     }

//     const convo = await ctx.db.get(normalizedId);
//     if (!convo) {
//       // ID is valid but document doesn't exist
//       return false;
//     }

//     return convo.userId === user._id;
//   },
// });

// Get all highlights for a conversation
export const getHighlightsByConversation = query({
  args: {
    conversationId: v.string() //v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    const normalizedId = ctx.db.normalizeId("conversations", args.conversationId);
    if (normalizedId === null) {
      return null;
    }

    return await ctx.db
      .query("highlights")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId as Id<"conversations">)
      )
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
  },
});

// Delete a highlight
export const deleteHighlight = mutation({
  args: {
    highlightId: v.id("highlights"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    const highlight = await ctx.db.get(args.highlightId);
    if (!highlight || highlight.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.highlightId);
    return { success: true };
  },
});
