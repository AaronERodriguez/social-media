import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUsersByClerkId } from "./_utils";
 
export const generateUploadUrl = mutation({
  args: {
    // ...
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});


        if (!currentUser) {
            throw new ConvexError("User not found")
        }
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveStorageId = mutation({
    args: {
        storageId: v.string(),
        type: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});


        if (!currentUser) {
            throw new ConvexError("User not found")
        }

            ctx.db.insert("images", {
                storageId: args.storageId,
                userId: currentUser._id,
                type: args.type
            })
    }
})