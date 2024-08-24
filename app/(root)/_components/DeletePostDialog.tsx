import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { api } from '@/convex/_generated/api'
import { useMutationState } from '@/hooks/useMutationState'
import { Post } from '@/types/types'
import { ConvexError } from 'convex/values'
import React from 'react'
import { toast } from 'sonner'

type Props = {
    post: Post;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DeletePostDialog = ({post, setOpen}: Props) => {

    const {mutate: deletePost, pending} = useMutationState(api.posts.deletePost)


    const handleDelete = async () => {
        await deletePost({postId: post._id}).then(() => {
            toast.success("Deleted Post")
        }).catch(error => {
            toast.error(error instanceof ConvexError ? error.data : "Unexpected Error Occurred")
        })
    }

  return (
    <AlertDialog onOpenChange={setOpen}>
        <AlertDialogTrigger className='w-full h-full text-start'>
            Delete
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete Content</AlertDialogTitle>
                <AlertDialogDescription>You will not be able to recover the likes you received in this post</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={pending}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeletePostDialog