import { Avatar } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { UserType } from '@/types/types'
import React from 'react'

type Props = {
    user: UserType;
}

const ProfileInfo = ({user}: Props) => {
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
        </CardHeader>
    </Card>
  )
}

export default ProfileInfo