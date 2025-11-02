import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";

async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
    .first();

  return user;
}

// Create a new explain side-chat
export const createExplainSideChat = mutation({
  args: {
    messageId: v.id("messages"),
    conversationId: v.id("conversations"),
    startOffset: v.number(),
    endOffset: v.number(),
    selectedText: v.string(),
    highlightColor: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const userId = user._id;

    const sideChatId = await ctx.db.insert("explainSideChats", {
      messageId: args.messageId,
      conversationId: args.conversationId,
      userId,
      startOffset: args.startOffset,
      endOffset: args.endOffset,
      selectedText: args.selectedText,
      highlightColor: args.highlightColor,
      // createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return sideChatId;
  },
});

// Get all explain side-chats for a conversation
export const getExplainSideChatsByConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const userId = user._id;

    const sideChats = await ctx.db
      .query("explainSideChats")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return sideChats;
  },
});

// Get all explain side-chats for a specific message
export const getExplainSideChatsByMessage = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const userId = user._id;

    const sideChats = await ctx.db
      .query("explainSideChats")
      .withIndex("by_messageId", (q) => q.eq("messageId", args.messageId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return sideChats;
  },
});

// Get a specific explain side-chat
export const getExplainSideChat = query({
  args: { sideChatId: v.id("explainSideChats") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const userId = user._id;

    const sideChat = await ctx.db.get(args.sideChatId);
    if (!sideChat || sideChat.userId !== userId) return null;

    return sideChat;
  },
});

// Delete an explain side-chat
export const deleteExplainSideChat = mutation({
  args: { sideChatId: v.id("explainSideChats") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const userId = user._id;

    const sideChat = await ctx.db.get(args.sideChatId);
    if (!sideChat || sideChat.userId !== userId) {
      throw new Error("Side-chat not found or unauthorized");
    }

    // Delete all messages in this side-chat
    const messages = await ctx.db
      .query("explainSideChatMessages")
      .withIndex("by_explainSideChatId", (q) =>
        q.eq("explainSideChatId", args.sideChatId)
      )
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the side-chat itself
    await ctx.db.delete(args.sideChatId);
  },
});

// Add a message to an explain side-chat
export const addExplainSideChatMessage = mutation({
  args: {
    explainSideChatId: v.id("explainSideChats"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    parts: v.array(
      v.object({
        type: v.string(),
        text: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const userId = user._id;

    // Verify ownership
    const sideChat = await ctx.db.get(args.explainSideChatId);
    if (!sideChat || sideChat.userId !== userId) {
      throw new Error("Side-chat not found or unauthorized");
    }

    const messageId = await ctx.db.insert("explainSideChatMessages", {
      explainSideChatId: args.explainSideChatId,
      role: args.role,
      parts: args.parts,
      timestamp: Date.now(),
    });

    // Update the side-chat's updatedAt timestamp
    await ctx.db.patch(args.explainSideChatId, {
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

// Get all messages for an explain side-chat
export const getExplainSideChatMessages = query({
  args: { explainSideChatId: v.id("explainSideChats") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const userId = user._id;

    // Verify ownership
    const sideChat = await ctx.db.get(args.explainSideChatId);
    if (!sideChat || sideChat.userId !== userId) return [];

    const messages = await ctx.db
      .query("explainSideChatMessages")
      .withIndex("by_explainSideChatId", (q) =>
        q.eq("explainSideChatId", args.explainSideChatId)
      )
      .order("asc")
      .collect();

    return messages;
  },
});
