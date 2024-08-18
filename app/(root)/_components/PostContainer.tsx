import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Post } from '@/types/types'
import { User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    post: Post
}

function PostContainer({post}: Props) {
  return (
    <Card className='w-64 h-96 flex flex-col items-center'>
        <CardHeader className='w-full h-full flex flex-col justify-between'>
            <CardTitle>{post.title}</CardTitle>
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