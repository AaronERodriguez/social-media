import { Id } from "@/convex/_generated/dataModel";

export type Post = {
    _id: Id<"posts">;
    _creationTime: number;
    likes?: Id<"users">[] | undefined;
    commentCount?: number | undefined;
    title: string;
    description: string;
    type: string;
    url: string;
    username: string;
    userId: Id<"users">;
    avatarUrl: string;
};

export type CommentType = {
    _id: Id<"comments">;
    _creationTime: number;
    username: string;
    userId: Id<"users">;
    avatarUrl: string;
    postId: string;
    content: string;
}

export type UserType = {
    _id: Id<"users">;
    _creationTime: number;
    followers?: Id<"users">[] | undefined;
    following?: Id<"users">[] | undefined;
    username: string;
    imageUrl: string;
    clerkId: string;
    email: string;
} | undefined