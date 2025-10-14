import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkUserId: v.string(),  // Clerk's unique user ID (e.g., "user_abc123")
        email: v.string(),        // For quick lookups (optional, from Clerk)
        name: v.optional(v.string()),  // Display name
        // Add LLM keys later: apiKeys: v.array(v.object({ llm: v.string(), key: v.string() })) – encrypt keys!
    })
        .index("by_clerkUserId", ["clerkUserId"])  // Fast auth lookups
        .index("by_email", ["email"]),

    conversations: defineTable({
        userId: v.id("users"),    // Foreign key to owner
        title: v.optional(v.string()),  // Auto-gen from first message? (e.g., "Chat about Calculus")
        createdAt: v.number(),    // Timestamp for sorting user's convos
        updatedAt: v.number(),    // Bump on new messages for "last active"
        // Metadata: v.optional(v.object({}))  // e.g., { llmUsed: "openai" }
    })
        .index("by_userId", ["userId"])  // Get all convos for a user
        .index("by_updatedAt", ["updatedAt"]),  // Recent convos first

    messages: defineTable({
        conversationId: v.id("conversations"),  // Foreign key
        role: v.union(v.literal("user"), v.literal("assistant")),  // From your JSON
        parts: v.array(  // Your JSON structure—flexible for text/images/etc.
            v.object({
                type: v.string(),  // "text", etc.
                text: v.optional(v.string()),
                // Add more: image_url: v.optional(v.string()), etc.
            })
        ),
        id: v.optional(v.string()),  // From JSON, if provided
        metadata: v.optional(v.object({})),  // chatId, etc. from sample
        timestamp: v.number(),  // For ordering in convo
    })
        .index("by_conversationId", ["conversationId"])  // Load full history
        .index("by_timestamp", ["timestamp"]),  // Chronological order
});