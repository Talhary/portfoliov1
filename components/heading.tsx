import React from 'react';

export const Heading = ({
  title,
  as: Component = 'h1'
}: {
  title: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}) => {
  return (
    <div className='mt-4 mx-2 max-mid:mt-16 max-md:mt-4 transition-all text-white'>
      <Component className='text-4xl max:lg:text-3xl max-md:text-2xl max-sm:text-xl font-semibold  after:bg-primary '>
        {title}
      </Component>
      <div className='bg-primary w-40 my-5 h-1 max-md:w-[6rem]  shadow-primary shadow'/>
    </div>
  );
};