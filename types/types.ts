import { Id } from "@/convex/_generated/dataModel";

export type Post = {
    _id: Id<"posts">;
    _creationTime: number;
    likes?: Id<"users">[] | undefined;
    title: string;
    description: string;
    type: string;
    url: string;
    username: string;
    userId: Id<"users">;
    avatarUrl: string;
};