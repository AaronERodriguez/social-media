import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Post, UserType } from '@/types/types'
import { MessageCircleIcon, MoreVertical, ThumbsUp, User } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import DeletePostDialog from './DeletePostDialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useMutationState } from '@/hooks/useMutationState'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { usePaginatedQuery } from 'convex/react'
import { useInView } from 'react-intersection-observer'
import Comment from './Comment'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'

type Props = {
    post: Post;
    user: UserType
}

const addCommentFormSchema = z.object({
    comment: z.string().min(1, { message: 'Comment cannot be empty' })
})

function PostContainer({post, user}: Props) {

    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [canOpen, setCanOpen] = useState(true);

    const {mutate: likePost, pending} = useMutationState(api.posts.toggleLike)
    const {mutate: addComment, pending: pendingComment} = useMutationState(api.comments.create)

    const {results: comments, status, loadMore} = usePaginatedQuery(api.comments.getPosts,
        {postId: post._id},
        { initialNumItems: 4}
    );

    const {ref, inView} = useInView()

    const form = useForm<z.infer<typeof addCommentFormSchema>>({
        resolver: zodResolver(addCommentFormSchema),
        defaultValues: {
            comment: ''
        }
    })

    const handleLike = async () => {
        await likePost({postId: post._id}).then(() => {
            return
        }).catch(error => {
            toast.error(error instanceof ConvexError ? error.data : "Unexpected Error Occurred")
        })
    };

    const handleComment = async (values: z.infer<typeof addCommentFormSchema>) => {
        await addComment({
            postId: post._id,
            content: values.comment
        }).then(() => {
            setOpen(false)
            toast.success("Added comment")
        }).catch(error => {
            toast.error(error instanceof ConvexError ? error.data : "Unexpected Error Occurred")
        }) 
    }

    useEffect(() => {
        if (inView) {
          if (status === 'CanLoadMore') {
            loadMore(4);
          }
        }
      }, [inView, status])

  return (
    <Dialog open={dialogOpen} onOpenChange={(e) => {
        setDialogOpen(canOpen ? e.valueOf() : false)
        }}>
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
                    <div className='flex justify-between items-center gap-4'>
                        
                        <div className='flex flex-row items-center gap-2'>
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
                            {post.likes?.length}</div>
                        <div className='flex flex-row gap-2'><MessageCircleIcon/> {post.commentCount}</div>
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
                {post.type === 'images' ? <img src={post.url} alt={post.title} className='block mx-auto max-h-80' /> : 
                    <video controls>
                        <source src={post.url}/>
                    </video>
                }
                <div className='flex flex-row justify-between items-center gap-2'>
                   
                        <div className='flex flex-row items-center gap-2'>
                            Posted by:  <Link className='flex flex-row items-center gap-2' href={`/users/details/${post.userId}`}><Avatar>
                            <AvatarImage src={post.avatarUrl} />
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <span className='text-primary-foreground'>
                            {post.username}
                        </span>
                        </Link>
                        </div>
                    
                <div className='flex flex-row items-center gap-2'>
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
                            {post.likes?.length}</div>
                </div>
                <span className='text-muted-foreground'>{(new Date(post._creationTime)).toDateString()}</span>
                <br />
                Description:
                <DialogDescription>
                    {post.description}
                </DialogDescription>
                {post.commentCount} Comments:
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleComment)} className='space-y-2'>
                        <FormField control={form.control} name='comment' render={({field}) => {
                            return <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Input placeholder='Add a comment...' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        }} />
                        <Button disabled={pendingComment} type='submit'>Post Comment</Button>
                    </form>
                </Form>
                {comments.length > 0 ?<ScrollArea className='h-36'>
                    {comments.map(comment => {
                        return <Comment comment={comment} key={comment._id} />
                    })}
                    {status === 'Exhausted' ? null : <span ref={ref}>
                        <Skeleton className='w-full h-36'></Skeleton>
                    </span>  }
                </ScrollArea> : null }
                
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default PostContainer