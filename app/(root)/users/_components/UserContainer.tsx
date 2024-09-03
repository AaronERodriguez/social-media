import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { UserType } from '@/types/types'
import { User, User2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
    user: UserType
}

const UserContainer = ({user}: Props) => {
  return (
    <Link href={`/users/details/${user?._id}`}>
        <Card className='transition-colors hover:bg-muted '>
            <CardHeader className='flex flex-row justify-between'>
                <div className='flex flex-row items-center gap-4'>
                    <Avatar>
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle>{user?.username}</CardTitle>
                </div>
                <div className='flex flex-row'>
                    <span>{user?.followersCount}</span> <User2/>
                </div>
            </CardHeader>
        </Card>
    </Link>
  )
}

export default UserContainer