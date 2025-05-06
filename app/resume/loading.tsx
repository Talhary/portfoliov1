import React from 'react';
import { cn } from '@/lib/utils'; // Make sure this path is correct

// --- Skeleton Sub-Components ---

/**
 * Skeleton loader for the main Heading component.
 */
const HeadingSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-9 w-48 md:w-64 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse",
        className
      )}
    ></div>
  );
};

/**
 * Skeleton loader for a single education entry.
 * This assumes a typical education entry structure.
 * Adjust if your EducationList items are significantly different.
 */
const EducationItemSkeleton = () => {
  return (
    <div className="mb-6 animate-pulse p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800/50">
      <div className="h-5 w-3/4 bg-neutral-300 dark:bg-neutral-600 rounded-md mb-2.5"></div> {/* Degree/Title */}
      <div className="h-4 w-1/2 bg-neutral-300 dark:bg-neutral-600 rounded-md mb-2"></div> {/* Institution */}
      <div className="h-3 w-1/3 bg-neutral-300 dark:bg-neutral-600 rounded-md"></div>      {/* Dates/Short Description */}
    </div>
  );
};

/**
 * Skeleton loader for the EducationList component.
 */
const EducationListSkeleton = ({ itemCount = 2 }: { itemCount?: number }) => {
  return (
    <div>
      {Array.from({ length: itemCount }).map((_, index) => (
        <EducationItemSkeleton key={index} />
      ))}
    </div>
  );
};

/**
 * Skeleton loader for a single skill entry.
 */
const SkillItemSkeleton = () => {
  return (
    <div className="space-y-2 animate-pulse"> {/* Matches original space-y */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="h-5 w-5 md:h-6 md:w-6 bg-neutral-300 dark:bg-neutral-600 rounded-full shrink-0"></div> {/* Icon Placeholder */}
          <div className="h-5 w-28 md:w-36 bg-neutral-300 dark:bg-neutral-600 rounded-md"></div> {/* Skill Name Placeholder */}
        </div>
        <div className="h-5 w-10 md:w-12 bg-neutral-300 dark:bg-neutral-600 rounded-md shrink-0"></div> {/* Percentage Placeholder */}
      </div>
      <div className="h-2 w-full bg-neutral-300 dark:bg-neutral-600 rounded-full"></div> {/* Slider Placeholder */}
    </div>
  );
};


// --- Main Page Skeleton ---

/**
 * Skeleton loader for the entire Resume Page.
 */
const ResumePageSkeleton = () => {
  const SKILL_ITEMS_SKELETON_COUNT = 7;
  const EDUCATION_ITEMS_SKELETON_COUNT = 2;

  return (
    <>
      <div>
        <div className="px-2 md:px-4 lg:px-6 pt-5"> {/* Approx. container for Heading */}
          <HeadingSkeleton />
        </div>


        {/* Education Section Skeleton */}
        <div className="mx-7 mt-12 max-md:mx-6 max-xs:mx-3">
          <div className="flex gap-x-6 items-center justify-start my-8 max-md:my-6 max-xs:my-4 max-md:gap-x-4 max-xs:gap-x-3 animate-pulse">
            <div className="h-7 w-7 md:h-8 md:w-8 bg-neutral-200 dark:bg-neutral-700 rounded max-xs:size-6 max-md:size-7"></div> {/* IoBookOutline Placeholder */}
            <div className='h-8 w-40 md:h-10 md:w-52 bg-neutral-200 dark:bg-neutral-700 rounded-md'></div> {/* "Education" Title Placeholder */}
          </div>
          <div>
            <EducationListSkeleton itemCount={EDUCATION_ITEMS_SKELETON_COUNT} />
          </div>
        </div>

        {/* Skills Section Title Skeleton */}
        <div className='mt-12 mx-7 max-md:mx-6 max-xs:mx-3'> {/* Consistent margin with Education section */}
          <div className='h-7 w-32 md:h-8 md:w-40 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse'></div> {/* "My Skills" Title Placeholder */}
        </div>

        {/* Skills List Card Skeleton */}
        <div className='mt-6 flex flex-col space-y-10 rounded-2xl m-3 shadow-sm p-6 bg-neutral-100 dark:bg-neutral-800/50 animate-pulse'>
          {Array.from({ length: SKILL_ITEMS_SKELETON_COUNT }).map((_, i) => (
            <SkillItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ResumePageSkeleton;