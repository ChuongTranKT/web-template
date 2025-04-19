"use client"
import { Card, CardContent } from "@/components/ui/card"
import * as React from "react"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Image from "next/image"

const feedbacks = [
  {
    image: "/assets/images/Rectangle 67.png",
  },
  {
    image: "/assets/images/Rectangle 65.png",
  },
  {
    image: "/assets/images/Rectangle 67.png",
  },
  {
    image: "/assets/images/Rectangle 65.png",
  },
  {
    image: "/assets/images/Rectangle 67.png",
  },
  {
    image: "/assets/images/Rectangle 65.png",
  },
  {
    image: "/assets/images/Rectangle 67.png",
  },
  {
    image: "/assets/images/Rectangle 65.png",
  },
]

const SlidePartner = () => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [, setCurrent] = React.useState(0)
  const [, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])
  return (
    <div className="flex flex-col items-center">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
        }}
        className="container mx-auto w-[290px] md:w-[650px] lg:w-[900px] xl:w-[1200px]"
      >
        <CarouselContent className="">
          {feedbacks.map((feedback, index) => (
            <CarouselItem
              key={index}
              className="basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <div className="lg:p-0">
                <Card className="border-none !shadow-none">
                  <CardContent className="p-1 lg:p-6">
                    <div className="flex flex-col items-center">
                      <Image
                        className="w-auto"
                        src={feedback.image}
                        height={112}
                        width={255}
                        layout="intrinsic" // Co giãn theo ảnh gốc
                        alt={`Feedback từ `}
                        quality={100}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  )
}

export default SlidePartner
