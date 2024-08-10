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
      className="w-full max-w-xs"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
      {images.map((el: string) => (
    <CarouselItem key={el}>
      <Image src={el} alt={el} height={400} width={400} className="w-[100%]" />
    </CarouselItem>
  ))}
      </CarouselContent>
    </Carousel>
  )
}


