import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Post, UserType } from '@/types/types'
import { MoreVertical, ThumbsUp, User } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import DeletePostDialog from './DeletePostDialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useMutationState } from '@/hooks/useMutationState'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'

type Props = {
    post: Post;
    user: UserType
}

function PostContainer({post, user}: Props) {

    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [canOpen, setCanOpen] = useState(true);

    const {mutate: likePost, pending} = useMutationState(api.posts.toggleLike)

    const handleLike = async () => {
        await likePost({postId: post._id}).then(() => {
            return
        }).catch(error => {
            toast.error(error instanceof ConvexError ? error.data : "Unexpected Error Occurred")
        })
    }

  return (
    <Dialog open={dialogOpen} onOpenChange={(e) => setDialogOpen(canOpen ? e.valueOf() : false)}>
        <DialogTrigger className='text-start transition-transform hover:scale-105 duration-300'>
            <Card className={`w-64 h-[400px] flex flex-col items-center`}>
                <CardHeader className='w-full h-full flex flex-col justify-between'>
                    <div className='flex justify-between items-center'>
                        <CardTitle className='truncate'>{post.title}</CardTitle>
                        {user?._id === post.userId ? <DropdownMenu open={open} onOpenChange={setOpen}>
                            <DropdownMenuTrigger className='transition-transform duration-300 hover:scale-125'>
                                <MoreVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={(e) => e.preventDefault()} className='text-destructive'>
                                    <DeletePostDialog post={post} setOpen={setOpen} />
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
                    <div className='flex justify-start items-center gap-4'>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button disabled={pending} onMouseEnter={() => setCanOpen(false)} onMouseLeave={() => setCanOpen(true)} onClick={handleLike} size={'icon'} variant={post.likes?.indexOf(user!._id) === -1 ? 'secondary' : 'default'}>
                                    <ThumbsUp />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Like
                            </TooltipContent>
                        </Tooltip>
                        <span>{post.likes?.length} {post.likes?.length === 1 ? 'Like' : 'Likes'}</span>
                    </div>
                    <CardDescription className='truncate max-h-24'>
                    {(new Date(post._creationTime)).toDateString()}<br/>
                    {post.description} 
                    </CardDescription>
                    
                </CardHeader>
            </Card>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{post.title}</DialogTitle>
                {post.type === 'images' ? <img src={post.url} alt={post.title} className='block mx-auto' /> : 
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
                <span className='text-muted-foreground'>{(new Date(post._creationTime)).toDateString()}</span>
                <br />
                Description:
                <DialogDescription>
                    {post.description}
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default PostContainer