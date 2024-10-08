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
            likes: [],
            commentCount: 0
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
        } else if (post.userId !== currentUser._id) {
            throw new ConvexError("You can't delete this post")
        }

        await ctx.db.delete(post._id)
    }
})

export const toggleLike = mutation({
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

        if (post.likes?.includes(currentUser._id)) {
            await ctx.db.patch(post._id, {
                likes: post.likes.filter(like => like !== currentUser._id)
            })
        } else {
            await ctx.db.patch(post._id, {
                likes: [currentUser._id, ...post.likes!]
            })
        }
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

export const get = query({
    args: {postId: v.id("posts")},
    handler: async (ctx,args) => {
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

        return post
    }
})

export const getMine = query({
    args: {paginationOpts: paginationOptsValidator},
    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});


        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const posts = await ctx.db.query("posts").withIndex("by_userId", q=>q.eq("userId", currentUser._id)).order('desc').paginate(args.paginationOpts)

        return posts
    }
})


export const getByUser = query({
    args: {paginationOpts: paginationOptsValidator, userId: v.id("users")},
    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});


        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const user = await ctx.db.get(args.userId);
        
        if (!user) {
            throw new ConvexError("Post not found")
        }

        const posts = await ctx.db.query("posts").withIndex("by_userId", q=>q.eq("userId", user._id)).order('desc').paginate(args.paginationOpts)

        return posts
    }
})

export const searchQuery = query({
    args: {paginationOpts: paginationOptsValidator, searchQuery: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
    
        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});


        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const posts = await ctx.db.query("posts").withSearchIndex("search_body", (q) => q.search("title", args.searchQuery)).paginate(args.paginationOpts);

        return posts
    }
})