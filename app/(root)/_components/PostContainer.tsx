import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Post, UserType } from '@/types/types'
import { MoreVertical, User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    post: Post;
    user: UserType
}

function PostContainer({post, user}: Props) {

    

  return (
    <Card className={`w-64 h-[400px] flex flex-col items-center`}>
        <CardHeader className='w-full h-full flex flex-col justify-between'>
            <div className='flex justify-between items-center'>
                <CardTitle className='truncate'>{post.title}</CardTitle>
                {user?._id === post.userId ? <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button size={'icon'}>
                            <MoreVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className='text-destructive'>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> : null}
            </div>
            {post.type === 'images' ? <img src={post.url} alt={post.title} className='max-w-64 max-h-96' /> : 
            <video controls>
                <source src={post.url}/>
            </video>
            }
            <div className='flex flex-row items-center gap-2'>Posted by: <Avatar>
                <AvatarImage src={post.avatarUrl} />
                <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <span className='text-primary-foreground'>
                {post.username}
            </span>
            </div>
            <CardDescription className='truncate max-h-24'>
            {(new Date(post._creationTime)).toDateString()}<br/>
            {post.description} 
            </CardDescription>
            
        </CardHeader>
    </Card>
  )
}

export default PostContainer