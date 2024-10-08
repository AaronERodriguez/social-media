"use client"

import PostContainer from '@/app/(root)/_components/PostContainer'
import ProfileInfo from '@/app/(root)/profile/_components/ProfileInfo'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

type Props = {}

const UserDetails = (props: Props) => {
    const {userId} = useParams();
    const currentUser = useQuery(api.user.getUser);
    const user = useQuery(api.user.getOtherUser, {userId: userId as Id<"users">})
    const isFollowing = useQuery(api.user.checkIfFollowing, {
      userId: userId as Id<"users">
    })

    const {results: followers, status: followersStatus, loadMore: followersLoadMore} = usePaginatedQuery(api.user.getUserFollowers, 
      {userId: userId as Id<"users">},
      { initialNumItems: 6 }
    )

    const {results: following, status: followingStatus, loadMore: followingLoadMore} = usePaginatedQuery(api.user.getUserFollowing, 
      {userId: userId as Id<"users">},
      { initialNumItems: 6 }
    )

    const {results: posts, status, loadMore} = usePaginatedQuery(api.posts.getByUser,
        {userId: userId as Id<"users">},
        { initialNumItems: 6}
      );

      const {ref, inView} = useInView()

      useEffect(() => {
        if (inView) {
          if (status === 'CanLoadMore') {
            loadMore(6);
          }
        }
      }, [inView, status]);

  return (
    <div className='flex flex-col gap-4'>
        <ProfileInfo following={following} followingLoadMore={followingLoadMore} followingStatus={followingStatus} followers={followers} followersLoadMore={followersLoadMore} followersStatus={followersStatus} isFollowing={isFollowing} user={user} currentUser={currentUser} postCount={posts.length} />
        <div className='flex sm:flex-row items-center justify-center flex-col flex-wrap gap-4'>
                {posts?.map((post) => {
                    return <PostContainer post={post} key={post._id} user={user} />
                })}
                {status === 'Exhausted' ? null : <div ref={ref}>
                <Skeleton className='w-64 h-[400px]'></Skeleton>
                </div>} 
        </div>
    </div>
  )
}

export default UserDetails