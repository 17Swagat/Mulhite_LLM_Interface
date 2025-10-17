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


export const fetchFirstDoc = query({
    handler: async (ctx) => {
        const result = await ctx.db.query('test_table').withIndex('by_numericValue', (q) => q.eq('numericValue', 100)).order('desc').first()

        return result;
    }
})




