"use client"

import { api } from '@/convex/_generated/api';
import { usePaginatedQuery, useQuery } from 'convex/react';
import React, { useEffect } from 'react'
import PostContainer from './_components/PostContainer';
import {useInView} from 'react-intersection-observer';

export default function Home() {
  const {results: posts, status, loadMore} = usePaginatedQuery(api.posts.getAll,
    {},
    { initialNumItems: 12}
  );

  const {ref, inView} = useInView()

useEffect(() => {
  if (inView) {
    if (status === 'CanLoadMore') {
      loadMore(6);
    }
  }
}, [inView])

  return (<>
      <h1 className="text-primary text-center text-4xl font-bold">Home</h1>
      <div className='flex sm:flex-row items-center justify-center flex-col flex-wrap gap-4'>
        {posts?.map((post) => {
          return <PostContainer post={post} key={post._id} />
        })}
        <span ref={ref}></span>
      </div>
    </>
  );
}
