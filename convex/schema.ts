import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    ////////////////////////////////////
    // Learning Convex with experimentation
    test_table: defineTable({
        message: v.string(),
        optionalTag: v.union(v.string(), v.null()),
        numericValue: v.number(),
        integerValue: v.number()
    })
        .index('by_numericValue', ['numericValue'])
        .index('by_numeric_integer_Value', ['numericValue', 'integerValue'])
        .index('by_staged_integerValue', { fields: ['integerValue'] }),

    ////////////////////////////////////

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
        conversationId: v.id("conversations"),  // Foreign key to conversation
        role: v.union(v.literal("user"), v.literal("assistant")),  // Message sender
        parts: v.array(  // Message content (supports text, reasoning, etc.)
            v.object({
                type: v.string(),  // "text", "reasoning", "image", etc.
                text: v.optional(v.string()),  // Text content
                // Future: Add image_url, file_url, etc.
            })
        ),
        timestamp: v.number(),  // Unix timestamp for ordering messages
        // Removed: id (Convex auto-generates _id)
        // Removed: metadata (not currently used)
    })
        .index("by_conversationId", ["conversationId"])  // Fast lookup of all messages in a conversation
        .index("by_timestamp", ["timestamp"]),  // Chronological ordering
});