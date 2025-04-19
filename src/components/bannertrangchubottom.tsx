"use client"
import { useEffect } from "react"
import Image from "next/image"
import { RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import ContactButton from "@/components/ui/contacbtn"
import { APIGetBannersAll } from "@/services/banners"
import { setBanner } from "@/store/slices/bannerSlice"

export default function BannerTrangChuBottom() {
  const dispatch = useDispatch()
  const banner = useSelector((state: RootState) => state.banner.banner)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await APIGetBannersAll()
        if (response?.status === 200) {
          dispatch(setBanner(response.data))
        }
      } catch (error) {
        console.error("❌ Error fetching banners:", error)
      }
    }

    fetchBanners()
  }, [dispatch])

  // Lọc banner theo display_page
  const filteredBanners = Array.isArray(banner)
    ? banner.filter((item) => item.display_page === "trang chủ dưới")
    : []

  return (
    <div>
      {filteredBanners.map((item, index) => {
        // Tách phần text và màu từ description
        const parts = item.description.split("|")
        const text = parts[0] // Nội dung chính
        const color = parts[1]?.split(":")[1] || "#000" // Mặc định là đen nếu không có màu

        return (
          <div
            key={index}
            className="container relative mx-auto mb-[60px] mt-[70px] p-[20px] md:p-[20px] lg:p-[50px] xl:p-[10px]"
          >
            {item.image_url && item.image_url.length > 0 ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${item.image_url[0]}`}
                alt="img"
                width={1264}
                height={515}
                className="h-full w-full object-cover"
              />
            ) : (
              <div></div>
            )}
            {/* Nội dung nằm trên ảnh */}
            <div className="absolute left-[15px] top-[60px] text-center md:left-[50px] md:top-[80px] lg:left-[100px] lg:top-[100px]">
              <p
                className="text-[12px] font-bold md:pb-[15px] md:text-[25px] lg:text-[30px] xl:text-[40px]"
                style={{ color }} // Áp dụng màu tách được vào style
              >
                {text}
              </p>
              <div className="mt-[10px] scale-[0.5] md:ml-[-30px] md:scale-[0.8] lg:ml-[40px] lg:scale-[1]">
                <ContactButton />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
