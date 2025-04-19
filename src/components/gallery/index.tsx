"use client"
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import Image from "next/image"

export interface GalleryProductProps {
  hoveredColor: { src: string } | null
  status: boolean
  images: string[]
}

const GalleryProduct = ({
  hoveredColor,
  status,
  images,
}: GalleryProductProps) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="container relative mx-auto flex flex-col items-center justify-center">
      <Carousel
        setApi={setApi}
        className="container mx-auto h-[170px] md:h-[240px] xl:h-[328px] xl:w-[608px]"
      >
        <CarouselContent>
          {images?.map((items, index) => (
            <CarouselItem
              key={index}
              className="h-[140px] md:h-[325px] md:w-[350px] xl:h-[480px] xl:w-[500px]"
            >
              <Card className="relative w-full rounded-none">
                <CardContent className="flex items-center justify-center p-0">
                  {/* Show hovered image if status is true, else fallback to the default one */}
                  <Image
                    src={
                      status && hoveredColor
                        ? hoveredColor.src.startsWith("http") // Nếu đã là URL đầy đủ, giữ nguyên
                          ? hoveredColor.src
                          : `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${hoveredColor.src}`
                        : items && items.startsWith("http")
                          ? items
                          : `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${items}`
                    }
                    alt={`Hình ${index + 1}`}
                    width={500}
                    height={600}
                    className="h-full w-full"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="relative hidden md:mt-[-160px] md:block xl:mt-[-250px]">
          {/* Nút Previous */}
          <CarouselPrevious className="absolute left-4 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75" />

          {/* Nút Next */}
          <CarouselNext className="absolute right-4 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75" />
        </div>
      </Carousel>

      {/* Thumbnails */}
      <div className="flex justify-center gap-2 md:mt-[100px] lg:mt-[160px]">
        {images?.map((items, i) => (
          <button key={i} onClick={() => api?.scrollTo(i)}>
            <Image
              src={
                items && items.startsWith("http")
                  ? items
                  : `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${items}`
              }
              alt={`Thumbnail ${i + 1}`}
              width={100}
              height={90}
              className={`h-full border-2 object-cover md:w-[115px] ${
                i === current
                  ? "border-[#79BCCF]"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default GalleryProduct
