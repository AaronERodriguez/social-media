"use client"

import { api } from '@/convex/_generated/api'
import { usePaginatedQuery, useQuery } from 'convex/react'
import React, { useEffect } from 'react'
import ProfileInfo from './_components/ProfileInfo'
import PostContainer from '../_components/PostContainer'
import { Skeleton } from '@/components/ui/skeleton'
import { useInView } from 'react-intersection-observer'

type Props = {}

const Profile = (props: Props) => {

    const user = useQuery(api.user.getUser)

    const {results: posts, status, loadMore} = usePaginatedQuery(api.posts.getMine,
        {},
        { initialNumItems: 6}
      );

    const {results: followers, status: followersStatus, loadMore: followersLoadMore} = usePaginatedQuery(api.user.getFollowers, 
      {},
      { initialNumItems: 6 }
    )

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
        <ProfileInfo isFollowing={false} user={user} currentUser={user} postCount={posts.length} followers={followers} followersStatus={followersStatus} followersLoadMore={followersLoadMore} />
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

export default Profile