// 1. Writing a Test `mutation` to add data to `test_table`

import { mutation, query } from "../_generated/server";
import { v } from 'convex/values';


export const addEntry_to_test_table = mutation({
    args: {
        message: v.string(),
        optionalTag: v.union(v.string(), v.null()),
        numericValue: v.number()
    },

    handler: async (
        ctx,
        args) => {

        const userId = await ctx.auth.getUserIdentity();
        const docId = await ctx.db.insert("test_table", {
            message: args.message,
            optionalTag: args.optionalTag,
            numericValue: args.numericValue
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

export const getSingleDoc_from_test_table = query({
    args:{
        id: v.id("test_table")
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.id);
        if (result === null) {
            console.log("No document found with that ID.");
            return { message: "No document found with that ID." };
        }
        return result;
    }
})



export const getData_HigherThanValue_from_test_table = query({
    args:{
        minValue: v.number()
    },
    handler: async (ctx, args) => {
        const filteredResults = await ctx.db.query('test_table')
        .withIndex('by_numericValue', 
            (q) =>  q.gte('numericValue', args.minValue))
        .order('desc')
        .collect()
        return filteredResults
    }
})