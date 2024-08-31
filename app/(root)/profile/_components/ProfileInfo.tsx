"use client"

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { UserType } from '@/types/types'
import React from 'react'

type Props = {
    user: UserType;
    currentUser: UserType
}

const ProfileInfo = ({user, currentUser}: Props) => {
  return (
    <Card>
        <CardHeader>
            <CardTitle>{user?.username}</CardTitle>
            <div className='flex flex-row w-full'>
                <img src={user?.imageUrl} className='w-44 h-44' />
                <div className='flex flex-row w-full justify-around items-center'>
                    <div className='flex flex-col items-center'>
                        <p>{user?.followers?.length}</p>
                        <p>Followers</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <p>{user?.following?.length}</p>
                        <p>Followers</p>
                    </div>
                </div>
            </div>
            <div>
                {currentUser?._id === user?._id ? null : <div className='flex flex-row'>
                    {currentUser ? user?.followers?.indexOf(currentUser._id) === -1 ? <Button className='w-full'>Follow</Button> : <Button variant={'secondary'}>Unfollow</Button> : null}
                </div> }
            </div>
        </CardHeader>
    </Card>
  )
}

export default ProfileInfo