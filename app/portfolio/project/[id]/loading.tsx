import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='h-screen w-screen '><Loader2 className='animate-spin h-10 w-10 max-md:h-5 max-md:w-5 dark:text-white' /></div>
  )
}

export default Loading