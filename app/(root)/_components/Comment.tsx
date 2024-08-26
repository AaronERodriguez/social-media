import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CommentType } from '@/types/types'
import React from 'react'

type Props = {
    comment: CommentType
}

const Comment = ({comment}: Props) => {
  return (
    <Card>
        <CardHeader className='flex flex-row items-center gap-4'>
            <Avatar>
                <AvatarImage src={comment.avatarUrl} />
                <AvatarFallback />
            </Avatar>
            <CardTitle>{comment.username}</CardTitle>
            <CardDescription>{(new Date(comment._creationTime)).toDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
            {comment.content}
        </CardContent>
    </Card>
  )
}

export default Comment