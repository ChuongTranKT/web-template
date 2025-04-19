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
import { RootState } from "@/store/store"
import Image from "next/image"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import Link from "next/link"

import { APIGetAllProducts } from "@/services/product"

const feedbacks = [
  {
    image: "/assets/images/Rectangle 52.png",
  },
  {
    image: "/assets/images/Rectangle 52.png",
  },
  {
    image: "/assets/images/Rectangle 52.png",
  },
  {
    image: "/assets/images/Rectangle 53.png",
  },
  {
    image: "/assets/images/Rectangle 52.png",
  },
]

const SlideFavoriteProduct = () => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [, setCurrent] = React.useState(0)
  const [, setCount] = React.useState(0)
  const [productFavorite, setProductFavorite] = useState([])

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/assets/images/sanpham.png"

    // Nếu là URL đầy đủ (bắt đầu bằng http)
    if (imageUrl.startsWith("http")) {
      return imageUrl
    }

    // Nếu là đường dẫn tương đối (bắt đầu bằng /images)
    return `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${imageUrl}`
  }

  const fetchAllproduct = async () => {
    try {
      const response = await APIGetAllProducts(1, 100, "", true)

      if (response?.status === 200) {
        setProductFavorite(response.data.content)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }
  useEffect(() => {
    fetchAllproduct()
  }, [])
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
  const createSlug = (name: string, id: number) => {
    return `${name.toLowerCase().replace(/\s+/g, "-")}-${id}`
  }
  return (
    <div className="mt-[30px] md:mt-[40px] lg:mt-[50px] xl:mt-[50px]">
      {productFavorite.length > 0 && (
        <div className="ml-[2px] flex flex-col">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
            }}
            className="mx-auto w-[290px] md:w-[630px] lg:w-[895px] xl:w-[1275px]"
          >
            <CarouselContent className="items-center">
              {productFavorite.map((item, index) => {
                const slug = createSlug(item.product_name, item._id)
                return (
                  <CarouselItem
                    key={index}
                    className="basis-1/2 md:basis-1/3 xl:basis-1/4"
                  >
                    <div className="mr-[2px] p-1">
                      <Link href={`/products/${slug}`} className="block">
                        <Card className="bg-red flex h-full w-full rounded-none border-none">
                          <CardContent className="flex flex-grow flex-col gap-[10px] p-0">
                            <Image
                              className="h-[146px] w-[127px] object-cover md:h-[190px] md:w-[200px] lg:h-[320px] lg:w-[297px]"
                              src={
                                item.images?.[0]
                                  ? getImageUrl(item.images[0])
                                  : "/assets/images/sanpham.png"
                              }
                              alt="image"
                              width={297}
                              height={185}
                            />
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </div>
  )
}

export default SlideFavoriteProduct
