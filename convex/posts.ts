import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUsersByClerkId } from "./_utils";


export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        type: v.string(),
        url: v.string()
    }, handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
    
        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});


        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        await ctx.db.insert("posts", {
            title: args.title,
            description: args.description,
            type: args.type,
            url: args.url,
            userId: currentUser._id
        })

    }
})