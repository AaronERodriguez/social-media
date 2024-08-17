import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutationState } from '@/hooks/useMutationState'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from 'convex/react'
import { ConvexError } from 'convex/values'
import { Plus, PlusCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ImageUploadZone } from './ImageUploadZone'
import { currentUser } from '@clerk/nextjs/server'
import { Textarea } from '@/components/ui/textarea'

type Props = {
}

const createPostFormSchema = z.object({
    title: z.string().min(1, {message: "This field can't be empty"}),
    description: z.string().min(1, {message: "This field can't be empty"}),
    type: z.string().min(1, {message: "You must select a type"}),
    url: z.string().min(1, {message: "This field can't be empty"}),
})

const CreatePostDialog = (props: Props) => {
    const [selected, setSelected] = useState<string>("");
    const [open, setOpen] = useState(false);

    const images = useQuery(api.images.getImages);

    const videos = useQuery(api.images.getVideos);

    const user = useQuery(api.user.getUser);

    const {mutate: createPost, pending} = useMutationState(api.posts.create); 
    
    const form = useForm<z.infer<typeof createPostFormSchema>>({
        resolver: zodResolver(createPostFormSchema),
        defaultValues: {
            title: "",
            description: "",
            url: '',
            type: '',
        }
    });
    const type = form.watch("type")
    
    useEffect(() => {
        console.log(type)
        setSelected("")
        form.resetField("title")
        form.resetField("description")
        form.resetField("url")
    }, [type])

    useEffect(() => {
        console.log(videos)
    }, [videos])
    
    const toggleSelection = (imageUrl: string) => {
        if (selected === imageUrl) {
            setSelected('');
            form.setValue("url", "");
        } else {
            setSelected(imageUrl);
            form.setValue("url", imageUrl);
        }
    }



    const handleSubmit = async (values: z.infer<typeof createPostFormSchema>) => {
        await createPost({title: values.title, description: values.description, type: values.type, url: values.url}).then(() => {
            form.reset();
            toast.success("Post created");
            setOpen(false);
        }).catch(error => {
            toast.error(error instanceof ConvexError ? error.data : "Unexpected Error Occurred");
        })
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger className='float-right'>
        <DialogTrigger asChild>
          <Button size={'icon'}>
                <Plus />
          </Button>
        </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Post</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className='block'>
        <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>Post anything for anyone to see</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                <FormField control={form.control} name='title' render={({field}) => {
                    return <FormItem>
                        <FormLabel className='capitalize'>Title</FormLabel>
                        <FormControl>
                            <Input placeholder={`Post Title...`} {...field} autoComplete='off' />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }} />
                <FormField control={form.control} name='description' render={({field}) => {
                        return <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder='Post description...' {...field} className='max-h-48' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }} />
                <FormField control={form.control} name='type' render={({field}) => {
                    return <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Post Type..."/>
                                </SelectTrigger>
                            </FormControl>
                                <SelectContent>
                                    <SelectItem value='images'>Image</SelectItem>
                                    <SelectItem value='videos'>Video</SelectItem>
                                </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                }} />
                {type ? <ImageUploadZone filetype={type} /> : null}
                {type === 'images' ? <>

                {images && images.length > 0 ? <div className='w-full block mx-auto'>
                    <Carousel className='w-full max-w-xs h-52 block mx-auto'>
                        <CarouselContent>
                            {images.map(image => {
                                return <CarouselItem key={image.id} className='block my-auto'>
                                    <img src={image.url!} className={`h-52 block mx-auto ${selected === image.url ? "border rounded-lg border-primary" : ""}`} onClick={() => toggleSelection(image.url!)} />
                                </CarouselItem>
                            })}
                        </CarouselContent>
                        <CarouselPrevious type='button'/>
                        <CarouselNext type='button'/>
                    </Carousel>
                </div> : null}
                </> : type === 'videos' ? <>

                {videos && videos.length > 0 ? <div className='w-full block mx-auto'>
                    <Carousel className='w-full max-w-xs h-52 block mx-auto'>
                        <CarouselContent>
                            {videos.map(video => {
                                return <CarouselItem key={video.id} className='block my-auto'>
                                    <video controls width={"320"} height={'240'} className={`blox mx-auto ${selected === video.url ? "border rounded-lg border-primary" : ""}`} onClick={() => toggleSelection(video.url!)}>
                                        <source src={video.url!}/>
                                    </video>
                                </CarouselItem>
                            })}
                        </CarouselContent>
                        <CarouselPrevious type='button'/>
                        <CarouselNext type='button'/>
                    </Carousel>
                </div> : null}
                </> : null }
                
                <DialogFooter>
                    <Button disabled={pending} type='submit'>Create</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePostDialog