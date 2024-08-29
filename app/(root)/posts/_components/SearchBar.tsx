"use client"

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { createRef, useEffect } from 'react'

type Props = {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({input, setInput}: Props) => {
    const handleChange = (value: React.ChangeEvent<HTMLInputElement>) => {
        setInput(value.target.value);
    }

    const redirectRef = createRef<HTMLAnchorElement>();

    useEffect(() => {
        const keyDownHandler = (e: any) => {
            if (e.code === 'Enter' && input !== '') {
                console.log("Pressed Enter")
                redirectRef.current?.click();
            }
        };
        document.addEventListener("keydown", keyDownHandler);
    
        // clean up
        return () => {
          document.removeEventListener("keydown", keyDownHandler);
        };
      }, [input]);
  
    return (
    <Card className='flex flex-row items-center p-2'>
        <Link ref={redirectRef} href={input !== '' ? `/posts/${input.replace(/ /g, '_')}` : ''}>
            <Button size={'icon'}>
                <Search />
            </Button>
        </Link>
        <Input className='border-none focus:outline-none' id='search-bar' type='text' placeholder='Search for a post...' value={input} onChange={(e) => handleChange(e)} />
    </Card>
  )
}

export default SearchBar