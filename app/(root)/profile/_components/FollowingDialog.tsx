import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Followers } from '@/types/types';
import React, { useEffect } from 'react'
import UserContainer from '../../users/_components/UserContainer';
import { User } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useInView } from 'react-intersection-observer';

type Props = {
    following: Followers;
    followingStatus: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
    followingLoadMore: (numItems: number) => void;
    followingCount: number | undefined;
}

const FollowingDialog = ({following, followingCount, followingLoadMore, followingStatus}: Props) => {
  
  const {ref, inView} = useInView()

  useEffect(() => {
    if (inView) {
      if (followingStatus === 'CanLoadMore') {
        followingLoadMore(6);
      }
    }
  }, [inView, followingStatus])

  return (
    <Dialog>
      <DialogTrigger>
      <div className='flex flex-col items-center'>
          <p>{followingCount}</p>
          <p>Following</p>
      </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Following: {followingCount}</DialogTitle>
        </DialogHeader>
        <ScrollArea className='max-h-96'>
          {following.length > 0 ? following.map(follower => {
            return <Link href={`/users/details/${follower?.userId}`} key={follower.userId}>
            <Card className='transition-colors hover:bg-muted '>
                <CardHeader className='flex flex-row justify-between'>
                    <div className='flex flex-row items-center gap-4'>
                        <Avatar>
                            <AvatarImage src={follower.followingAvatarUrl} />
                            <AvatarFallback>
                                <User />
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle>{follower.followingUsername}</CardTitle>
                    </div>
                </CardHeader>
            </Card>
        </Link>
          }) : <Card><CardHeader><CardTitle>No Following</CardTitle></CardHeader></Card>}
          {followingStatus === 'Exhausted' ? null : <div ref={ref} >
      <Skeleton className='w-full h-24'></Skeleton>
      </div>} 
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default FollowingDialog