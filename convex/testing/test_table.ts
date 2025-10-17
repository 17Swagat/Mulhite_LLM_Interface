// 1. Writing a Test `mutation` to add data to `test_table`

import { mutation, query } from "../_generated/server";
import { v } from 'convex/values';


export const addEntry = mutation({
    args: {
        message: v.string(),
        optionalTag: v.union(v.string(), v.null()),
        numericValue: v.number(),
        integerValue: v.number()
    },
    handler: (ctx, args) => {
        const docId = ctx.db.insert('test_table', {
            message: args.message,
            optionalTag: args.optionalTag,
            numericValue: args.numericValue,
            integerValue: args.integerValue
        })

        return docId;
    }
});


export const fetchEntries = query({
    handler: (ctx) => {
        const results = ctx.db.query('test_table').collect()
        return results;
    }
})


export const fetchFilteredData = query({
    args: {
        minNumericValue: v.number(),
        minIntegerValue: v.number()
    },
    handler: async (ctx, args) => {
        const results = await ctx.db.query('test_table')
            .withIndex('by_numeric_integer_Value',
                (q) => q.gte('numericValue', args.minNumericValue))
            .filter((q) => q.gte(q.field('integerValue'), args.minIntegerValue))
            .collect()
        return results;
    }
})


// Searching for a particular text
export const fetchSearchedDocs = query({
    args: {
        searchTerm: v.string()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('test_table')
            .withSearchIndex(
                'search_message',
                (q) => q.search('message', args.searchTerm)
            ).take(10)

        return result;
    }
})