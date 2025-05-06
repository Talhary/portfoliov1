'use client'
import React from 'react'

import { PinTopIcon } from '@radix-ui/react-icons'

export const GetToTopButton = () => {
  return (
    <div className='bottom-1 fixed right-4 z-50 '>
        <div className='bg-black bg-opacity-70 p-4 rounded-full ' onClick={()=>{window.scrollTo({top:0,left: 0,behavior: 'smooth'})}}><PinTopIcon className='text-primary'/></div>
    </div>
  )
}
