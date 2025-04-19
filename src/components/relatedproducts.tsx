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
    id: 1,
    image: "/assets/images/Rectangle 52.png",
    name: "Sản phẩm 1",
    code: "TEDF001",
    price: "200.000",
  },
  {
    id: 2,
    image: "/assets/images/Rectangle 52.png",
    name: "Sản phẩm 2",
    code: "TEDF002",
    price: "250.000",
  },
  {
    id: 3,
    image: "/assets/images/Rectangle 52.png",
    name: "Sản phẩm 3",
    code: "TEDF003",
    price: "300.000",
  },
  {
    id: 4,
    image: "/assets/images/Rectangle 53.png",
    name: "Sản phẩm 4",
    code: "TEDF004",
    price: "180.000",
  },
  {
    id: 5,
    image: "/assets/images/Rectangle 52.png",
    name: "Sản phẩm 5",
    code: "TEDF005",
    price: "220.000",
  },
]

const RelatedProducts = ({
  product,
  onProductSelect,
}: {
  product: Product[]
  onProductSelect: (id: number) => void
}) => {
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
    <div className="mt-[30px] md:mt-[40px] lg:mt-[50px] xl:mt-[50px]">
      <div className="ml-[2px] flex flex-col">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
          }}
          className="mx-auto w-[290px] md:w-[630px] lg:w-[895px] xl:w-[1275px]"
        >
          <CarouselContent className="items-center">
            {product.map((product, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 md:basis-1/3 xl:basis-1/4"
                onClick={() => onProductSelect(product._id)}
              >
                <div className="mr-[2px] p-1">
                  <Card className="flex h-full w-full rounded-none border-none">
                    <CardContent className="flex min-h-[150px] flex-grow flex-col gap-[10px] p-0 md:min-h-[270px] lg:min-h-[400px]">
                      <Image
                        className="h-full w-full object-cover"
                        src={
                          product.images[0]
                            ? product.images[0].startsWith("http") // Nếu đã là URL đầy đủ, giữ nguyên
                              ? product.images[0]
                              : `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${product.images[0].startsWith("/") ? "" : "/"}${product.images[0]}`
                            : "/default.png" // Nếu không có ảnh, dùng ảnh mặc định
                        }
                        alt={product.name}
                        width={297}
                        height={185}
                      />
                      <div className="p-2 pb-5 text-center text-[10px] xl:text-[16px]">
                        <h3 className="">{product.product_name}</h3>
                        <p className="text-gray-500">Mã: {product.code}</p>
                        <p className="font-bold text-red-600">
                          {product.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default RelatedProducts
