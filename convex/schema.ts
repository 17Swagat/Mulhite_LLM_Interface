import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    users: defineTable({
        clerkUserId: v.string(),  // Clerk's unique user ID (e.g., "user_abc123")
        email: v.string(),        // For quick lookups (optional, from Clerk)
        name: v.optional(v.string()),  // Display name
        // Add LLM keys later: apiKeys: v.array(v.object({ llm: v.string(), key: v.string() })) – encrypt keys!

        apiKeys: v.optional(v.array(v.object({ llm: v.string(), key: v.string() })))
    })
        .index("by_clerkUserId", ["clerkUserId"])  // Fast auth lookups
        .index("by_email", ["email"]),

    conversations: defineTable({
        userId: v.id("users"),    // Foreign key to owner
        title: v.optional(v.string()),  // Auto-gen from first message? (e.g., "Chat about Calculus")
        // createdAt: v.number(),    // Timestamp for sorting user's convos
        updatedAt: v.number(),    // Bump on new messages for "last active"
        // Metadata: v.optional(v.object({}))  // e.g., { llmUsed: "openai" }
    })
        .index("by_userId", ["userId"])  // Get all convos for a user
        .index("by_updatedAt", ["updatedAt"]),  // Recent convos first

    messages: defineTable({
        conversationId: v.id("conversations"),  // Foreign key to conversation
        role: v.union(v.literal("user"), v.literal("assistant")),  // Message sender
        // ai_model: v.optional(v.string()), // e.g., "deepseek-r1:1.5b" (store which model generated assistant messages)
        ai_model: v.optional(v.string()), // e.g., "deepseek-r1:1.5b" (store which model generated assistant messages)
        parts: v.array(  // Message content (supports text, reasoning, etc.)
            v.object({
                type: v.string(),  // "text", "reasoning", "image", etc.
                text: v.optional(v.string()),  // Text content
                // Future: Add image_url, file_url, etc.
            })
        ),

        // TODO: "Must find a way to <DELETE> it & configure based on the PreSaved-Time (By Convex)"
        timestamp: v.number(),  // Unix timestamp for ordering messages

        // NEW-Field: $COST
        totalTokens: v.optional(v.string()),
    })
        .index("by_conversationId", ["conversationId"])  // Fast lookup of all messages in a conversation
        .index("by_timestamp", ["timestamp"]),  // Chronological ordering

    highlights: defineTable({
        messageId: v.id("messages"),  // Which message this highlight belongs to
        conversationId: v.id("conversations"),  // For easy querying
        userId: v.id("users"),  // Who created the highlight
        startOffset: v.number(),  // Character offset where highlight starts
        endOffset: v.number(),  // Character offset where highlight ends
        text: v.string(),  // The highlighted text (for display/search)
        color: v.optional(v.string()),  // Highlight color (default: yellow)
        // createdAt: v.number(),  // Timestamp
    })
        .index("by_messageId", ["messageId"])  // Get all highlights for a message
        .index("by_conversationId", ["conversationId"])  // Get all highlights in a conversation
        .index("by_userId", ["userId"]),  // Get all user's highlights

    explainSideChats: defineTable({
        messageId: v.id("messages"),  // Original message where text was selected
        conversationId: v.id("conversations"),  // Parent conversation
        userId: v.id("users"),  // Who created this side-chat
        startOffset: v.number(),  // Character offset where selected text starts
        endOffset: v.number(),  // Character offset where selected text ends
        selectedText: v.string(),  // The text that was selected for explanation
        highlightColor: v.string(),  // Color to highlight the clickable text (e.g., "blue", "purple")
        updatedAt: v.number(),  // Last activity timestamp
    })
        .index("by_messageId", ["messageId"])  // Get all side-chats for a message
        .index("by_conversationId", ["conversationId"])  // Get all side-chats in a conversation
        .index("by_userId", ["userId"]),  // Get all user's side-chats

    explainSideChatMessages: defineTable({
        explainSideChatId: v.id("explainSideChats"),  // Which side-chat this message belongs to
        role: v.union(v.literal("user"), v.literal("assistant")),  // Message sender
        parts: v.array(  // Message content
            v.object({
                type: v.string(),  // "text", "reasoning", etc.
                text: v.optional(v.string()),  // Text content
            })
        ),
        ai_model: v.optional(v.string()),  // Model used for this message
        timestamp: v.number(),  // Unix timestamp for ordering
    })
        .index("by_explainSideChatId", ["explainSideChatId"])  // Get all messages in a side-chat
        .index("by_timestamp", ["timestamp"]),  // Chronological ordering
});