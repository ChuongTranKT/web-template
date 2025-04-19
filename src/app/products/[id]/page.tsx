"use client"
import { AccordionProducts } from "@/components/accordion"
import Footer from "@/components/footer"
import GalleryProduct from "@/components/gallery"
import RelatedProducts from "@/components/relatedproducts"

import Image from "next/image"
import React, { useState, useCallback, useEffect } from "react"
import { FaPhoneAlt } from "react-icons/fa"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { APIGetProductById, APIGetAllProducts } from "@/services/product"
import { useParams } from "next/navigation"
import { AccordionItem, Product } from "@/types"

interface Color {
  name: string
  imgSrc: string
}

interface Size {
  name: string
}

interface AccordionProductsProps {
  products: AccordionItem[]
  key?: string | number
}

interface RelatedProductsProps {
  product: Product[]
  onProductSelect: (id: number) => void
}

export default function ProductDetail() {
  const getIdFromSlug = (slug: string) => {
    const parts = slug.split("-")
    return parts[parts.length - 1] // Lấy phần cuối cùng (ID)
  }

  const params = useParams()
  const [productId, setProductId] = useState<string | null>(null)
  const aboutUs = useSelector((state: RootState) => state.aboutUs.aboutUs)

  useEffect(() => {
    if (params?.id) {
      setProductId(getIdFromSlug(params.id as string))
    }
  }, [params])
  const sizeProduct: Size[] = []
  const [selectedColor, setSelectedColor] = useState<Color | null>(null) // Đảm bảo selectedColor có thể là null hoặc một đối tượng Color
  const [hoveredColor, setHoveredColor] = useState<{ src: string } | null>(null)

  const [status, setStatus] = useState(false)
  const [idCategory, setIdCategory] = useState<string | null>(null)
  const [productRelated, setProductRelated] = useState<Product[]>([])

  const [product, setProduct] = useState<Product>({
    material: "",
    warranty: "",
    description: "",
    product_name: "",
    code: "",
    price: 0,
    images: [],
  })

  const fetchProductById = useCallback(async () => {
    if (productId) {
      try {
        const res = await APIGetProductById(productId)
        if (res?.status === 200) {
          setProduct(res.data)
          setIdCategory(res.data.category_id._id)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
  }, [productId])

  const fetchAllproduct = useCallback(async () => {
    try {
      const response = await APIGetAllProducts(1, 1000, idCategory || undefined)
      if (response?.data) {
        setProductRelated(response.data.content)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }, [idCategory])

  useEffect(() => {
    fetchProductById()
  }, [fetchProductById])

  useEffect(() => {
    fetchAllproduct()
  }, [fetchAllproduct])

  const descriptionProduct = [
    {
      id: 1,
      description: product.material,
      title: "Chất liệu",
    },
    {
      id: 2,
      description: product.warranty,
      title: "Bảo hành",
    },
    {
      id: 3,
      description: product.description,
      title: "Mô tả",
    },
  ]

  const handleMouseEnter = (color: string) => {
    setHoveredColor({ src: color })
    setStatus(true)
  }

  const handleMouseLeave = () => {
    setHoveredColor(null)
    setStatus(false)
  }

  const handleProductSelect = (id: number) => {
    setProductId(id.toString())
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const colorProduct: Color[] =
    product?.classification?.map((item, key) => ({
      name:
        item.classifications.find((c) => c.classification_name === "color")
          ?.classification_value || "Không xác định",
      imgSrc: item.images || "/assets/images/default.png",
    })) || [] // Nếu
  //
  // const colorProduct: Color[] =
  const sizes =
    product?.classification?.map((item, key) => ({
      name:
        item.classifications.find((c) => c.classification_name === "size")
          ?.classification_value || "Không xác định",
    })) || []

  return (
    <div>
      <div className="mt-[90px] flex scale-[0.9] text-[12px] md:mt-[90px] md:scale-[0.9] md:text-[14px] xl:mt-[100px] xl:scale-[1]">
        {/* left content */}
        <div className="w-[300px] md:w-[400px] xl:flex xl:flex-1">
          <GalleryProduct
            hoveredColor={hoveredColor}
            status={status}
            images={product.images || []}
          />
        </div>
        <div className="px-[25px]"></div>
        {/* right content */}
        <div className="w-[200px] flex-1 flex-col md:w-[600px] md:leading-[50px] lg:w-full xl:h-[600px] xl:leading-[55px]">
          <p className="md:text-[28px]">{product.product_name}</p>
          <span className="md:text-[23px]">
            Mã hàng : <strong>{product.code}</strong>
          </span>
          <span className="block text-red-400">
            <strong className="md:text-[30px]">
              {product.price
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)
                : "Đang cập nhật"}
            </strong>
          </span>

          <div className="mt-2 flex flex-wrap items-center space-x-2">
            <p className="mr-2">Màu sắc:</p>
            {colorProduct.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)} // Cập nhật màu khi click
                onMouseEnter={() => handleMouseEnter(color.imgSrc)} // Thay đổi ảnh khi hover
                onMouseLeave={handleMouseLeave} // Trả lại ảnh khi không hover
                className={`flex items-center rounded-full border-2 px-2 py-1 text-sm text-gray-700 ${selectedColor?.name === color.name ? "border-[#79BCCF]" : ""} mb-2 hover:border-[#79BCCF] focus:outline-none`}
              >
                <Image
                  src={
                    color.imgSrc && color.imgSrc.trim() !== "" // Đảm bảo không bị rỗng
                      ? color.imgSrc.startsWith("http")
                        ? color.imgSrc
                        : `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${color.imgSrc.startsWith("/") ? "" : "/"}${color.imgSrc}`
                      : "/default.png"
                  }
                  alt="img"
                  width={18}
                  height={18}
                />

                <span className="ml-2">{color.name}</span>
              </button>
            ))}
          </div>
          <p className="mr-2">
            Size: {[...new Set(sizes.map((size, key) => size.name))].join(", ")}
          </p>

          <a href={`tel:${aboutUs.phone}`}>
            <button className="mt-5 flex h-12 w-44 animate-pulse items-center rounded-full border-2 border-black bg-gray-300 text-black">
              <div className="flex h-full w-12 items-center justify-center rounded-full bg-black p-3">
                <FaPhoneAlt className="text-white" />
              </div>

              <span className="ml-2">Liên hệ ngay</span>
            </button>
          </a>
          <div className="mt-[30px] hidden lg:block lg:w-[650px]">
            <AccordionProducts
              key={productId}
              products={descriptionProduct as AccordionItem[]}
            />
          </div>
        </div>
      </div>
      {/* CHO MOBILE */}
      <div className="block p-[15px] md:p-[30px] lg:hidden">
        <AccordionProducts key={productId} products={descriptionProduct} />
      </div>

      <div className="mt-[-20px] md:mt-[-100px] xl:mt-[0px]">
        <div className="mt-[-50px] pb-[-50px] pt-[100px] text-center md:mt-[0px] lg:mt-[0px] xl:mt-[0px]">
          <p className="relative inline-block md:text-[24px]">
            SẢN PHẨM LIÊN QUAN
            {/* Border bottom */}
            <span className="absolute bottom-[-5] left-1/2 w-[60px] -translate-x-1/2 transform rounded-full border-b-4 border-[#374151] md:w-[88px]"></span>
          </p>
        </div>

        <RelatedProducts
          product={productRelated}
          onProductSelect={handleProductSelect}
        />
      </div>

      <div className="xl:mt-[30px]">
        <Footer />
      </div>
    </div>
  )
}
