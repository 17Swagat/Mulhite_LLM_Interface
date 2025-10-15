// 1. Writing a Test `mutation` to add data to `test_table`

import { mutation, query } from "../_generated/server";
import { v } from 'convex/values';

export const addEntry_to_test_table = mutation({
    args: {
        message: v.string(),
        // optionalTag: v.optional(v.string()) 
        optionalTag: v.union(v.string(), v.null())
    },

    handler: async (
        ctx,
        args) => {

        const userId = await ctx.auth.getUserIdentity();
        const docId = await ctx.db.insert("test_table", {
            message: args.message,
            // optionalTag: args.optionalTag ?? undefined
            optionalTag: args.optionalTag //?? undefined
        });

        return { success: true, id: docId, userId };
    }
})

export const getData_from_test_table = query({
    args: {},
    handler: async (ctx, args) => {
        const result = await ctx.db.query('test_table').collect()
        return result;
    }
})