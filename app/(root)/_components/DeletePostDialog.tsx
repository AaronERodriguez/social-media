import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { api } from '@/convex/_generated/api'
import { useMutationState } from '@/hooks/useMutationState'
import { Post } from '@/types/types'
import { ConvexError } from 'convex/values'
import React from 'react'
import { toast } from 'sonner'

type Props = {
    post: Post
}

const DeletePostDialog = ({post}: Props) => {

    const {mutate: deletePost, pending} = useMutationState(api.posts.deletePost)

    const handleDelete = async () => {
        await deletePost({postId: post._id}).then(() => {
            toast.success("Deleted Post")
        }).catch(error => {
            toast.error(error instanceof ConvexError ? error.data : "Unexpected Error Occurred")
        })
    }

  return (
    <AlertDialog>
        <AlertDialogTrigger>
            Delete
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete Content</AlertDialogTitle>
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