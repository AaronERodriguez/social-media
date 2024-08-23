import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUsersByClerkId } from "./_utils";
import { paginationOptsValidator } from "convex/server";


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
            userId: currentUser._id,
            username: currentUser.username,
            avatarUrl: currentUser.imageUrl,
            likes: []
        })

    }
})

export const deletePost = mutation({
    args: {postId: v.id("posts")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
    
        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});


        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const post = await ctx.db.get(args.postId);

        if (!post) {
            throw new ConvexError("Post not found")
        }

        await ctx.db.delete(post._id)
    }
})

export const getAll = query({
    args: {paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
    
        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});


        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const posts = await ctx.db.query("posts").order("desc").paginate(args.paginationOpts);

        return posts
    }
})