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
    username: string;
    imageUrl: string;
    clerkId: string;
    email: string;
    followersCount: number;
    followingCount: number;
} | undefined

export type Followers = {
    _id: Id<"users_followers">;
    _creationTime: number;
    userId: Id<"users">;
    followerId: Id<"users">;
    followerUsername: string;
    followerAvatarUrl: string;
    followingUsername: string;
    followingAvatarUrl: string;
}[]
