import {defineSchema, defineTable} from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string(),
        followers: v.optional(v.array(v.id("users"))),
        following: v.optional(v.array(v.id("users")))
    }).index("by_email", ["email"]).index("by_clerkId", ["clerkId"]).searchIndex("search_body", {
        searchField: "username",
    }),
    posts: defineTable({
        userId: v.id("users"),
        username: v.string(),
        avatarUrl: v.string(),
        title: v.string(),
        description: v.string(),
        type: v.string(),
        url: v.string(),
        likes: v.optional(v.array(v.id("users"))),
        commentCount: v.optional(v.number())
    }).index("by_userId", ["userId"]).index("by_type", ["type"]).searchIndex("search_body", {
        searchField: "title",
    }),
    images: defineTable({
        storageId: v.string(),
        userId: v.id("users"),
        type: v.optional(v.string())
    }).index("by_userId", ["userId"]).index("by_type", ["type"]),
    comments: defineTable({
        postId: v.string(),
        userId: v.id("users"),
        username: v.string(),
        avatarUrl: v.string(),
        content: v.string()
    }).index("by_userId", ["userId"]).index("by_postId", ["postId"])

})