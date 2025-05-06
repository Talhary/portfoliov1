import React from 'react';

/**
 * Skeleton loader for a single project card.
 */
const ProjectCardSkeleton = () => {
  return (
    <div className="max-h-lg my-3 w-[20rem] max-md:my-1 bg-white bg-opacity-5 dark:bg-neutral-800 dark:bg-opacity-70 card shadow-lg rounded-lg overflow-hidden max-w-sm animate-pulse">
      {/* Image Carousel Placeholder */}
      <div className="relative h-48 overflow-hidden bg-neutral-300 dark:bg-neutral-700"></div>

      <div className="p-4 max-md:p-3 max-sm:p-2">
        {/* Title Placeholder */}
        <div className="h-6 w-3/4 bg-neutral-300 dark:bg-neutral-600 rounded-md mb-1"></div>
        <div className="h-4 w-1/2 bg-neutral-300 dark:bg-neutral-600 rounded-md mb-3 md:mb-4"></div>


        <div className="mt-2 max-md:mt-1 flex items-center space-x-3">
          {/* View Project Button Placeholder */}
          <div className="h-10 w-28 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
          {/* Details Button Placeholder */}
          <div className="h-10 w-24 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton loader for the AllProjects component.
 * @param {object} props - Component props.
 * @param {number} [props.count=3] - The number of skeleton cards to display.
 */
const Loading =  ({ count = 6 }: { count?: number }) => {
  return (
    <div className='flex overflow-hidden items-start lg:justify-start max-lg:justify-center flex-wrap gap-3 mt-3 max-md:gap-2'>
      {Array.from({ length: count }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
};
export default Loading