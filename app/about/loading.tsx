import React from 'react';
import { cn } from '@/lib/utils'; // Assuming 'cn' is a utility for conditional class names

// Skeleton component for the main Heading
const HeadingSkeletonLoader = () => {
  return <div className="h-9 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse mb-4"></div>;
};

// Skeleton component for the AsideImageSection (typically an image and some text)
const AsideImageSectionSkeletonLoader = ({ className }: { className?: string }) => {
  return (
    <div className={cn('my-4 flex flex-col items-center justify-center animate-pulse', className)}>
      <div className="h-40 w-40 md:h-48 md:w-48 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
      <div className="h-4 w-2/5 bg-neutral-200 dark:bg-neutral-700 rounded-md mt-4"></div>
      <div className="h-3 w-3/5 bg-neutral-200 dark:bg-neutral-700 rounded-md mt-2"></div>
    </div>
  );
};

// Skeleton component for individual skill pills
const SkillPillSkeletonLoader = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse">
      <div className="h-4 w-4 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div>
      <div className="h-4 w-20 bg-neutral-300 dark:bg-neutral-600 rounded-md"></div>
    </div>
  );
};

// Skeleton component for focus area cards
const FocusAreaCardSkeletonLoader = () => {
  return (
    <div className='card flex flex-col sm:flex-row items-start gap-4 rounded-2xl w-full max-md:p-3 shadow-md dark:shadow-none p-6 bg-neutral-100 dark:bg-neutral-800/50 animate-pulse'>
      <div className='flex-shrink-0 max-md:hidden'>
        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-neutral-300 dark:bg-neutral-700 rounded-md"></div>
      </div>
      <div className='flex-grow space-y-3'>
        <div className="h-6 w-3/4 bg-neutral-300 dark:bg-neutral-700 rounded-md"></div>
        <div className="h-4 w-full bg-neutral-300 dark:bg-neutral-700 rounded-md"></div>
        <div className="h-4 w-5/6 bg-neutral-300 dark:bg-neutral-700 rounded-md"></div>
      </div>
    </div>
  );
};

// Skeleton component for experience cards
const ExperienceCardSkeletonLoader = () => {
  return (
    <div className='card flex flex-col sm:flex-row items-start gap-4 rounded-2xl w-full max-md:p-3 sm:w-80 md:w-96 shadow-md dark:shadow-none p-6 bg-neutral-100 dark:bg-neutral-800/50 animate-pulse'>
      <div className='flex-shrink-0 max-md:hidden'>
        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-neutral-300 dark:bg-neutral-700 rounded-md"></div>
      </div>
      <div className='flex-grow space-y-2.5'>
        <div className="h-6 w-3/4 bg-neutral-300 dark:bg-neutral-700 rounded-md"></div> {/* Title */}
        <div className="h-4 w-1/2 bg-neutral-300 dark:bg-neutral-700 rounded-md"></div> {/* Company */}
        <div className="h-4 w-full bg-neutral-300 dark:bg-neutral-700 rounded-md mt-1"></div> {/* Description line 1 */}
        <div className="h-4 w-5/6 bg-neutral-300 dark:bg-neutral-700 rounded-md"></div> {/* Description line 2 */}
        <div className="h-4 w-1/3 bg-neutral-300 dark:bg-neutral-700 rounded-md pt-2"></div> {/* Dates */}
      </div>
    </div>
  );
};


const PageSkeleton = () => {
  // Number of skeleton items to show for repeating elements
  const SKELETON_SKILL_COUNT = 12;
  const SKELETON_FOCUS_COUNT = 3;
  const SKELETON_EXPERIENCE_COUNT = 2;

  return (
    <>
      <div className='px-2 md:px-4 lg:px-6 pt-5 pb-10 text-neutral-800 dark:text-neutral-200'>
        <HeadingSkeletonLoader />

        <AsideImageSectionSkeletonLoader className='md:hidden my-4 flex flex-col items-center justify-center' />

        {/* Bio Section Skeleton */}
        <section className='mt-6 mx-2 max-md:mx-0'>
          {/* <h2 className="text-2xl font-semibold mb-4 text-neutral-100 dark:text-white hidden">Bio</h2> // This was hidden */}
          <div className='space-y-2.5 animate-pulse'>
            <div className="h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-md"></div>
            <div className="h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-md"></div>
            <div className="h-5 w-11/12 bg-neutral-200 dark:bg-neutral-700 rounded-md"></div>
            <div className="h-5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded-md"></div>
          </div>
        </section>

        {/* My Skillset Section Skeleton */}
        <section className='mt-12 mx-2 max-md:mx-0'>
          <div className='h-7 w-2/5 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse mb-6'></div> {/* "My Skillset" heading */}
          <div className='flex flex-wrap gap-3'>
            {Array.from({ length: SKELETON_SKILL_COUNT }).map((_, index) => (
              <SkillPillSkeletonLoader key={index} />
            ))}
          </div>
        </section>

        {/* My Focus Areas Section Skeleton */}
        <section className='mt-12 mx-2 max-md:mx-0'>
          <div className='h-7 w-2/5 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse mb-6'></div> {/* "My Focus Areas" heading */}
          <div className='grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:gap-y-9 max-sm:grid-cols-1'>
            {Array.from({ length: SKELETON_FOCUS_COUNT }).map((_, index) => (
              <FocusAreaCardSkeletonLoader key={index} />
            ))}
          </div>
        </section>

        {/* Experience Section Skeleton */}
        <section className='mx-2 max-md:mx-0 mt-12'> {/* Adjusted margin-top to match other sections */}
          <div className='h-7 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse mb-6'></div> {/* "Experience" heading */}
          <div className='flex flex-wrap justify-start gap-6 mt-4'>
            {Array.from({ length: SKELETON_EXPERIENCE_COUNT }).map((_, index) => (
              <ExperienceCardSkeletonLoader key={index} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default PageSkeleton;