import { Loader2 } from 'lucide-react';
import React from 'react';

// Optional: Utility function for merging Tailwind classes (common in shadcn/ui)
// You can install clsx and tailwind-merge: npm install clsx tailwind-merge
// Or create this file: src/lib/utils.ts
// import { type ClassValue, clsx } from "clsx"
// import { twMerge } from "tailwind-merge"
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }
// If you don't have `cn`, just replace `cn(...)` with template literals `` or simple string concatenation.
import { cn } from "@/lib/utils"; // Adjust the import path if necessary

interface LoadingProps {
  /** Additional classes for the container div */
  className?: string;
  /** Additional classes for the Loader icon */
  iconClassName?: string;
  /** Optional text to display next to the spinner */
  text?: string;
  /** Predefined sizes matching the original component's logic */
  size?: 'default' | 'sm';
}

const Loading: React.FC<LoadingProps> = ({
  className,
  iconClassName,
  text,
  size = 'default' // Default to the larger size
}) => {
  // Determine icon size classes based on the prop
  const sizeClasses = size === 'sm'
    ? 'h-5 w-5' // Corresponds to original max-md:h-5 max-md:w-5
    : 'h-10 w-10'; // Corresponds to original h-10 w-10

  return (
    // Use flex to center content. Added min-height for stability in layout.
    // Added padding for spacing if text is present.
    <div
      role="status" // Announce as a status update to screen readers
      className={cn(
        "flex min-h-[60px] items-center justify-center p-4", // Center content, provide min height & padding
        className // Allow overriding/extending container styles
      )}
    >
      <Loader2
        className={cn(
          "animate-spin",
           // Use neutral colors for better theme adaptation - adjust if needed
          "text-neutral-600 dark:text-neutral-400",
          sizeClasses,    // Apply dynamic size
          iconClassName // Allow overriding/extending icon styles
        )}
        aria-hidden="true" // Hide decorative icon from screen readers
      />

      {/* Optional text */}
      {text && (
        <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
          {text}
        </span>
      )}

      {/* Screen reader only text */}
      <span className="sr-only">{text || 'Loading...'}</span>
    </div>
  );
};

export default Loading;