"use client"

import { api } from '@/convex/_generated/api';
import { usePaginatedQuery } from 'convex/react';
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer';
import UserContainer from '../_components/UserContainer';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {}

const UserPage = (props: Props) => {

  const params = useParams();

  const {results: users, status, loadMore} = usePaginatedQuery(api.user.searchQuery,
    {searchQuery: (params.searchQuery as string).replace(/_/g, ' ')},
    { initialNumItems: 12}
  );

  const {ref, inView} = useInView()

  useEffect(() => {
    if (inView) {
      if (status === 'CanLoadMore') {
        loadMore(6);
      }
    }
  }, [inView, status])

  return (
    <div>{users.map(userInstance => {
      return <UserContainer user={userInstance} />
    })}
    {status === 'Exhausted' ? null : <div ref={ref} >
      <Skeleton className='w-full h-24'></Skeleton>
      </div>} 
    </div>
  )
}

export default UserPage