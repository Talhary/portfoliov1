"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#353537] dark:bg-[#353537]">
      <SliderPrimitive.Range className="absolute h-full bg-primary dark:bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="hidden  h-4 w-4 rounded-full border border-stone-200 border-stone-900/50 bg-primary shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50 dark:border-stone-800 dark:border-stone-50/50 dark:bg-primary dark:focus-visible:ring-stone-300" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
