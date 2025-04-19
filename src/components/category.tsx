"use client"
import Image from "next/image"
import Link from "next/link"
import { setCategory } from "@/store/slices/categorySlice"
import { APIGetAllCategory } from "@/services/category"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"

export default function CategoryGrid() {
  const categories = useSelector((state: RootState) => state.category.category)
  const dispatch = useDispatch()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await APIGetAllCategory()
      if (res) dispatch(setCategory(res.data))
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const renderCategoryItem = (index: number) => {
    if (!categories[index]) return null

    const defaultImages = [
      "/assets/images/Rectangle 58.png",
      "/assets/images/Rectangle 60.png",
      "/assets/images/Rectangle 61.png",
      "/assets/images/Rectangle 59.png",
    ]

    const layouts = [
      {
        containerClass:
          "relative h-[506px] w-[466px] cursor-pointer overflow-hidden",
        spanClass:
          "absolute bottom-[160px] left-[32px] z-[50] text-center tracking-[2px]",
        width: 466,
      },
      {
        containerClass:
          "relative h-[506px] w-[762px] cursor-pointer overflow-hidden",
        spanClass:
          "absolute bottom-[50px] right-[32px] z-[50] text-center tracking-[2px]",
        width: 762,
      },
      {
        containerClass:
          "relative h-[506px] w-[762px] cursor-pointer overflow-hidden",
        spanClass:
          "absolute bottom-[150px] left-[300px] z-[50] text-center tracking-[2px]",
        width: 762,
      },
      {
        containerClass:
          "relative h-[506px] w-[466px] cursor-pointer overflow-hidden",
        spanClass: "absolute left-[120px] top-[120px] z-[50] tracking-[2px]",
        width: 466,
      },
    ]

    const layout = layouts[index % 4]
    const category = categories[index]
    const defaultImage = defaultImages[index % 4]

    // Đảm bảo imageUrl không bao giờ là chuỗi rỗng
    let imageUrl = defaultImage // Luôn có giá trị mặc định
    if (category.category_image && category.category_image.trim() !== "") {
      imageUrl = `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${category.category_image}`
    }

    return (
      <Link href={`/products?category=${category._id}`} key={category._id}>
        <div className={layout.containerClass}>
          <span className={layout.spanClass}>{category.category_name}</span>
          <Image
            src={imageUrl}
            alt={category.category_name || "Category image"}
            width={layout.width}
            height={506}
            quality={100}
            className="h-full w-full transform object-cover transition-transform duration-300 ease-in-out hover:scale-[1.2]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.3)] to-[rgba(0,0,0,0.60)]"></div>
        </div>
      </Link>
    )
  }

  return (
    <div className="container mx-auto mt-[-410px] flex h-full scale-[27%] flex-col items-center gap-4 text-[56px] font-[500] text-white md:mt-[-220px] md:scale-[58%] lg:mt-[-150px] lg:scale-[75%] xl:mt-[0px] xl:scale-[1]">
      {categories.length > 0 && (
        <>
          <div className="flex flex-row gap-4">
            {renderCategoryItem(0)}
            {renderCategoryItem(1)}
          </div>
          <div className="flex flex-1 flex-row gap-4">
            {renderCategoryItem(2)}
            {renderCategoryItem(3)}
          </div>
          {categories.length > 4 && (
            <div className="flex flex-wrap gap-4">
              {categories
                .slice(4)
                .map((_, index) => renderCategoryItem(index + 4))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
