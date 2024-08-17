import {defineSchema, defineTable} from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string(),
        followers: v.optional(v.array(v.id("users")))
    }).index("by_email", ["email"]).index("by_clerkId", ["clerkId"]),
    images: defineTable({
        storageId: v.string(),
        userId: v.id("users"),
        type: v.optional(v.string())
    }).index("by_userId", ["userId"]).index("by_type", ["type"])
})