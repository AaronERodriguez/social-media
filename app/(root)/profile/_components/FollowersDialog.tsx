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
  followers: Followers;
  followersStatus: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
  followersLoadMore: (numItems: number) => void;
  followersCount: number | undefined;
}

const FollowersDialog = ({followers, followersStatus, followersLoadMore, followersCount}: Props) => {
  
  const {ref, inView} = useInView()

  useEffect(() => {
    if (inView) {
      if (followersStatus === 'CanLoadMore') {
        followersLoadMore(6);
      }
    }
  }, [inView, followersStatus])

  return (
    <Dialog>
      <DialogTrigger>
      <div className='flex flex-col items-center'>
          <p>{followersCount}</p>
          <p>Followers</p>
      </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Followers: {followersCount}</DialogTitle>
        </DialogHeader>
        <ScrollArea className='max-h-96'>
          {followers.length > 0 ? followers.map(follower => {
            return <Link href={`/users/details/${follower?.followerId}`} key={follower.followerId}>
            <Card className='transition-colors hover:bg-muted '>
                <CardHeader className='flex flex-row justify-between'>
                    <div className='flex flex-row items-center gap-4'>
                        <Avatar>
                            <AvatarImage src={follower.followerAvatarUrl} />
                            <AvatarFallback>
                                <User />
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle>{follower.followerUsername}</CardTitle>
                    </div>
                </CardHeader>
            </Card>
        </Link>
          }) : null}
          {followersStatus === 'Exhausted' ? null : <div ref={ref} >
      <Skeleton className='w-full h-24'></Skeleton>
      </div>} 
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default FollowersDialog