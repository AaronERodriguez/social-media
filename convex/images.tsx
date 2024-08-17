import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUsersByClerkId } from "./_utils";

export const getImages = query({args: {

}, handler: async (ctx,args) => {
    const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});


        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const images = await ctx.db.query("images").withIndex("by_userId", q => q.eq("userId", currentUser._id)).filter(q => q.eq(q.field("type"), "images")).collect();

        return Promise.all(images.map(async (image) => ({
            id: image._id,
            storageId: image.storageId,
            url: await ctx.storage.getUrl(image.storageId)
        })))
}})

export const getVideos = query({args: {

}, handler: async (ctx,args) => {
    const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Unauthorized")
        }

        const currentUser = await getUsersByClerkId({ctx, clerkId: identity.subject});


        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const images = await ctx.db.query("images").withIndex("by_userId", q => q.eq("userId", currentUser._id)).filter(q => q.eq(q.field("type"), "videos")).collect();

        return Promise.all(images.map(async (image) => ({
            id: image._id,
            storageId: image.storageId,
            url: await ctx.storage.getUrl(image.storageId)
        })))
}}) 