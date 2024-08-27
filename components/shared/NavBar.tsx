"use client"

import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Home, User } from 'lucide-react'
import { ModeToggle } from './ModeToggle'
import { useClerk, UserButton } from '@clerk/nextjs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import CreatePostDialog from '@/app/(root)/_components/CreatePostDialog'

type Props = {}

const NavBar = (props: Props) => {
    const {signOut} = useClerk();
    const user = useQuery(api.user.getUser);
  return (
    <nav className='w-full fixed z-10 flex flex-row justify-between p-2 bg-secondary items-center font-bold text-2xl'>
        <Link href={'/'} className='text-secondary-foreground'>Connected</Link>
        <div className='flex flex-row gap-4'>
            <Link href={'/'}>
                <Button size={'icon'}>
                    <Home />
                </Button>
            </Link>
            <CreatePostDialog />
        </div>
        <div className='flex flex-row justify-end items-center gap-7'>
            <ModeToggle />
            <Tooltip >
                <DropdownMenu>
                    <DropdownMenuTrigger className='flex items-center justify-center focus:border-none active:border-none'>
                        <TooltipTrigger>
                            <Avatar>
                                <AvatarImage src={user?.imageUrl} />
                                <AvatarFallback>
                                    <User />
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className='p-0'>
                            <Link href={'/profile'} className='w-full h-full m-0 p-2'>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => signOut()} className='p-0'>
                            <span className='w-full h-full m-0 p-2 text-red-600 '>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <TooltipContent>{user?.username}</TooltipContent>
            </Tooltip>
        </div>
    </nav>
  )
}

export default NavBar