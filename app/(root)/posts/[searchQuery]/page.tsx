"use client"

import { api } from '@/convex/_generated/api';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { useParams } from 'next/navigation'
import React, { createRef, useEffect } from 'react'
import PostContainer from '../../_components/PostContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { useInView } from 'react-intersection-observer';

type Props = {}

const Result = (props: Props) => {

  const params = useParams();

  const {results: posts, status, loadMore} = usePaginatedQuery(api.posts.searchQuery,
    {searchQuery: (params.searchQuery as string).replace(/_/g, ' ')},
    { initialNumItems: 12}
  );

  const user = useQuery(api.user.getUser)

  const {ref, inView} = useInView()

  useEffect(() => {
    if (inView) {
      if (status === 'CanLoadMore') {
        loadMore(6);
      }
    }
  }, [inView, status])

  return (
    <div className='flex sm:flex-row items-center justify-center flex-col flex-wrap gap-4'>
      {posts.length === 0 ? <div>No Matches Found</div> : posts.map(post => {
        return <PostContainer post={post} user={user} />
      })}
      {status === 'Exhausted' ? null : <span ref={ref}>
          <Skeleton className='w-64 h-[400px]'></Skeleton>
        </span>}
    </div>
  )
}

export default Result