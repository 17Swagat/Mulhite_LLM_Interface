import { query, mutation } from '@/../convex/_generated/server'
import { v } from 'convex/values';

import { Id } from '../_generated/dataModel';
import { paginationOptsValidator } from 'convex/server';



interface Type_MessagesByUser {
    _id: Id<"test_table">;
    _creationTime: number;
    message: string;
    user: string;
}

export const postMessageByUser = mutation({
    args: {
        message: v.string()
    },
    handler: async (ctx, args) => {
        // 1. Get current user
        const current_user = await ctx.auth.getUserIdentity();
        // console.log(current_user)
        ctx.db.insert('test_table', {
            user: current_user?.email ?? '',
            message: args.message
        })
    }
})



export const messagesByUser = query({
    handler: async (ctx) => {
        const current_user = await ctx.auth.getUserIdentity()
        let result: Type_MessagesByUser[] = [];
        if (current_user) {
            result = await ctx.db.query('test_table').withIndex('by_user', q => q.eq('user', current_user.email!)).order('desc').collect()
        }
        // console.log(current_user)
        return result;
    }
});


export const messagesByUserPaginated = query({
    args: {
        paginationOpts: paginationOptsValidator,
        reset: v.boolean()
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.auth.getUserIdentity();
        const results = await ctx.db.query('test_table')
        .withIndex('by_user', q => q.eq('user', currentUser?.email!))
        .paginate(args.paginationOpts)
        return results
    }
})