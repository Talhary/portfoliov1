'use client'
import { type CarouselApi } from "@/components/ui/carousel"
import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import Autoplay from "embla-carousel-autoplay"
  import Image from 'next/image'
export function ImageCarousel({images}:{images:string[]}) {

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  )


  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
      {images.map((el: string) => (
    <CarouselItem key={el}>
      <div className="relative w-full h-48 sm:h-52 overflow-hidden rounded-t-2xl">
        <Image src={el} alt="Project screenshot" fill className="object-cover" />
      </div>
    </CarouselItem>
  ))}
      </CarouselContent>
    </Carousel>
  )
}


