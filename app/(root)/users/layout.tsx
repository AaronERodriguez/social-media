"use client"

import React, { PropsWithChildren, useState } from 'react'
import UserSearchBar from './_components/UserSearchBar';

type Props = PropsWithChildren<{}>

const UserSearchPage = ({children}: Props) => {
  const [input, setInput] = useState("");


  return (
    <div className='flex flex-col gap-4'>
      <div>
        <UserSearchBar input={input} setInput={setInput} />
      </div>
      {children}
    </div>
  )
}

export default UserSearchPage