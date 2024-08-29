"use client"
import React, { PropsWithChildren, useState } from 'react'
import SearchBar from './_components/SearchBar';

type Props = PropsWithChildren<{}>

const PostSearch = ({children}: Props) => {
    const [input, setInput] = useState('');

    
  return (
    <div className='flex flex-col gap-4'>
      <div>
        <SearchBar input={input} setInput={setInput} />
      </div>
      {children}
    </div>
  )
}

export default PostSearch