"use client"

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import React from 'react'
import PostContainer from './_components/PostContainer';


export default function Home() {
  const posts = useQuery(api.posts.getAll);
  return (<>
      <h1 className="text-primary text-center text-4xl font-bold">Home</h1>
      <div className='flex sm:flex-row items-center flex-col flex-wrap gap-4'>
        {posts?.map(post => {
          return <PostContainer post={post} />
        })}
      </div>
    </>
  );
}
