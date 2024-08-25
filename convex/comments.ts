import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUsersByClerkId } from "./_utils";
import { paginationOptsValidator } from "convex/server";


export const create = mutation({
    args: {
        postId: v.id("posts"),
        content: v.string(),
    }, handler: async (ctx, args) => {
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
            throw new ConvexError("Post not found");
        }

        await ctx.db.insert("comments", {
            postId: args.postId,
            userId: currentUser._id,
            username: currentUser.username,
            avatarUrl: currentUser.imageUrl,
            content: args.content,
        })

        await ctx.db.patch(post._id, {
            commentCount: post.commentCount! + 1
        })

    }
})

export const getPosts = query({
    args: {paginationOpts: paginationOptsValidator, postId: v.id("posts") },
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
            throw new ConvexError("Post not found");
        }

        const comments = await ctx.db.query("comments").withIndex("by_postId", q=>q.eq("postId", args.postId)).order("desc").paginate(args.paginationOpts);

        return comments
    }
})