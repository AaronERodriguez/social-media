import { ConvexError, v } from "convex/values"
import {internalMutation, internalQuery, mutation, query, QueryCtx} from "./_generated/server"
import { getUsersByClerkId } from "./_utils";
import { paginationOptsValidator } from "convex/server";

export const create = internalMutation({
    args: {
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("users", {...args, followersCount: 0, followingCount: 0});
    },
})

export const get = internalQuery({
    args: {clerkId: v.string()},
    async handler(ctx, args) {
        return ctx.db.query("users").withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId)).unique();
    }
})


export const deleteFromClerk = internalMutation({
    args: { clerkUserId: v.string() },
    async handler(ctx, { clerkUserId }) {
        const user = await userByExternalId(ctx, clerkUserId)
        
        if (user !== null) {
            await ctx.db.delete(user._id);
        } else {
            console.warn(
                `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
            );
        }
    },
});

async function userByExternalId(ctx: QueryCtx, externalId: string) {
    return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", externalId))
    .unique();
}

export const getUser = query({args: {}, handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if(!identity) {
        throw new Error("Unauthorized")
    }
    
    const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});
    
    
    if (!currentUser) {
        throw new ConvexError("User not found")
    }
    
    return currentUser
}})

export const getOtherUser = query({args: {
    userId: v.id('users'),
}, handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if(!identity) {
        throw new Error("Unauthorized")
    }
    
    const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});
    
    
    if (!currentUser) {
        throw new ConvexError("User not found")
    }

    const targetUser = await ctx.db.query('users').withIndex("by_id", q => q.eq("_id", args.userId)).unique();

    if (!targetUser) {
        throw new ConvexError("User not found")
    }

    return targetUser
}})

export const getAll = query({args: {}, handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if(!identity) {
        throw new Error("Unauthorized")
    }
    
    const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});
    
    
    if (!currentUser) {
        throw new ConvexError("User not found")
    }

    const users = await ctx.db.query("users").collect();

    return users;
}})

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

        const users = await ctx.db.query("users").withSearchIndex("search_body", (q) => q.search("username", args.searchQuery)).paginate(args.paginationOpts);

        return users;
    }
})

export const toggleFollow = mutation({
    args: {userId: v.id("users")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
    
        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});


        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const userToFollow = await ctx.db.get(args.userId)

        if (!userToFollow) {
            throw new ConvexError("User not found")
        } else if (userToFollow._id === currentUser._id) {
            throw new ConvexError("Cannot follow yourself")
        }

        const isFollowing = await ctx.db.query("users_followers").withIndex("by_userId_followerId", q => q.eq("userId", userToFollow._id).eq("followerId", currentUser._id)).unique()

        if (isFollowing) {
            //Unfollow
            await ctx.db.delete(isFollowing._id)
            await ctx.db.patch(userToFollow._id, {
                followersCount: userToFollow.followersCount! - 1
            })
            await ctx.db.patch(currentUser._id, {
                followingCount: currentUser.followingCount! - 1
            })
        } else {
            //Follow
            await ctx.db.insert("users_followers", {
                userId: userToFollow._id,
                followerId: currentUser._id,
                followerUsername: currentUser.username,
                followerAvatarUrl: currentUser.imageUrl,
                followingAvatarUrl: userToFollow.imageUrl,
                followingUsername: userToFollow.username
            })
            await ctx.db.patch(userToFollow._id, {
                followersCount: userToFollow.followersCount! + 1
            })
            await ctx.db.patch(currentUser._id, {
                followingCount: currentUser.followingCount! + 1
            })
        }
    }
})

export const checkIfFollowing = query({
    args: {userId: v.id("users")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
    
        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});


        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const isFollowing = await ctx.db.query("users_followers").withIndex("by_userId_followerId", q => q.eq("userId", args.userId).eq("followerId", currentUser._id)).unique();

        if (isFollowing) {
            return true
        } else {
            return false
        }
    }
})

export const getFollowers = query({
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

        const users = await ctx.db.query("users_followers").withIndex("by_userId", (q) => q.eq("userId", currentUser._id)).paginate(args.paginationOpts);

        return users;
    }
})

export const getFollowing = query({
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

        const users = await ctx.db.query("users_followers").withIndex("by_followerId", (q) => q.eq("followerId", currentUser._id)).paginate(args.paginationOpts);

        return users;
    }
})

export const getUserFollowing = query({
    args: {paginationOpts: paginationOptsValidator, userId: v.id("users") },
    handler: async (ctx, args) => {
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
            throw new ConvexError("User not found")
        }

        const users = await ctx.db.query("users_followers").withIndex("by_followerId", (q) => q.eq("followerId", user._id)).paginate(args.paginationOpts);

        return users;
    }
})

export const getUserFollowers = query({
    args: {paginationOpts: paginationOptsValidator, userId: v.id("users") },
    handler: async (ctx, args) => {
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
            throw new ConvexError("User not found")
        }

        const users = await ctx.db.query("users_followers").withIndex("by_userId", (q) => q.eq("userId", user._id)).paginate(args.paginationOpts);

        return users;
    }
})