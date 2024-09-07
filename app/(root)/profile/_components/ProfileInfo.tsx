"use client"

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useMutationState } from '@/hooks/useMutationState';
import { Followers, UserType } from '@/types/types'
import { ConvexError } from 'convex/values';
import React from 'react'
import { toast } from 'sonner';
import FollowersDialog from './FollowersDialog';

type Props = {
    user: UserType;
    currentUser: UserType
    postCount: number;
    isFollowing: boolean | undefined;
    followers: Followers;
    followersStatus: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
    followersLoadMore: (numItems: number) => void;
}

const ProfileInfo = ({user, currentUser, postCount, isFollowing, followers, followersStatus, followersLoadMore}: Props) => {

    const {mutate: follow, pending} = useMutationState(api.user.toggleFollow);

    const handleToggle = async () => {
        await follow({userId: user?._id}).then(() => {
            toast.success("Toggled Follow")
        }).catch(error => {
            toast.error(error instanceof ConvexError ? error.data : "Unexpected Error Occurred")
        })
    }

  return (
    <Card>
        <CardHeader>
            <CardTitle>{user?.username}</CardTitle>
            <div className='flex flex-row w-full'>
                <img src={user?.imageUrl} className='w-44 h-44' />
                <div className='flex flex-row w-full justify-around items-center'>
                    <FollowersDialog followers={followers} followersLoadMore={followersLoadMore} followersStatus={followersStatus} followersCount={user?.followersCount} />
                    <div className='flex flex-col items-center'>
                        <p>{user?.followingCount}</p>
                        <p>Following</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <p>{postCount}</p>
                        <p>Posts</p>
                    </div>
                </div>
            </div>
            <div>
                {currentUser?._id === user?._id ? null : <div className='flex flex-row'>
                    {currentUser ? isFollowing ? <Button disabled={pending} onClick={handleToggle} variant={'secondary'} className='w-full'>Unfollow</Button> : <Button onClick={handleToggle} disabled={pending} className='w-full'>Follow</Button> : null}
                </div> }
            </div>
        </CardHeader>
    </Card>
  )
}

export default ProfileInfo