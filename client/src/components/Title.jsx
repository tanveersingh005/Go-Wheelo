/* eslint-disable no-unused-vars */
import React from 'react'

const Title = ({title , subTitle , align}) => {
  return (
    <div className={`flex flex-col justify-center items-center text-center ${align === 'left' && 'md:items-start md:text-left'}`}>
      <h1 className='font-bold tracking-tight text-4xl md:text-5xl text-zinc-900 dark:text-zinc-50'>{title}</h1>
      <p className='text-sm md:text-base text-zinc-500 dark:text-zinc-400 mt-3 max-w-[620px]'>{subTitle}</p>
    </div>
  )
}

export default Title
