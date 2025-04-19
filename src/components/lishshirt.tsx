"use client"
import { useState, useEffect } from "react"
import Img from "./ui/image"
import Image from "next/image"
import { RootState } from "@/store/store"
import { APIGetBannersAll } from "@/services/banners"
import { setBanner } from "@/store/slices/bannerSlice"
import { useDispatch, useSelector } from "react-redux"

export default function ListShirt() {
  const banner = useSelector((state: RootState) => state.banner.banner)
  const dispatch = useDispatch()

  // Fetch dữ liệu banner từ API
  const handleGetAllBanner = async () => {
    try {
      const response = await APIGetBannersAll()
      if (response?.status === 200) {
        dispatch(setBanner(response.data))
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleGetAllBanner()
  }, [])

  // Kiểm tra và lấy các giá trị từ banner
  const getShirtsData = (pageType) => {
    // Lọc theo display_page trước
    const filteredData = banner.filter(
      (item) => item.display_page === "trang chủ trên"
    )

    // Bỏ phần tử đầu tiên và map phần còn lại
    return filteredData.slice(1).map((item, index) => {
      const [price, color] = item.description?.split("|color:") || ["", ""]
      const mainColor = color ? color.trim() : ""
      return {
        id: (index + 1).toString(), // Index bắt đầu từ 1
        name: item.title,
        src:
          item.image_url.length > 0
            ? `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${item.image_url[0]}`
            : null, // Kiểm tra nếu có ảnh
        mainColor: mainColor,
        price: price || "Giá chưa có",
      }
    })
  }

  // Gọi hàm getShirtsData() khi dữ liệu banner thay đổi
  const [shirts, setShirts] = useState([])
  console.log(shirts)
  const [selectedShirt, setSelectedShirt] = useState(
    shirts.length > 0 ? shirts[0] : null
  )

  useEffect(() => {
    const shirtData = getShirtsData()
    setShirts(shirtData)
    setSelectedShirt(shirtData[0] || null) // Chọn áo đầu tiên nếu có dữ liệu
  }, [banner]) // Đảm bảo rằng khi dữ liệu banner thay đổi, mảng shirts cũng sẽ được cập nhật.

  useEffect(() => {
    if (selectedShirt) {
    }
  }, [selectedShirt]) // Log khi selectedShirt thay đổi.

  const getDotStyles = (shirtId) => {
    switch (shirtId) {
      case "1":
        return {
          dot1: {
            width: "102px",
            translateX: "142px",
            sm: { width: "80px", translateX: "120px" },
            md: { width: "102px", translateX: "142px" },
          },
          dot2: {
            width: "130px",
            translateX: "245px",
            sm: { width: "110px", translateX: "180px" },
            md: { width: "130px", translateX: "245px" },
          },
          dot3: {
            width: "148px",
            translateX: "396px",
            sm: { width: "130px", translateX: "320px" },
            md: { width: "148px", translateX: "396px" },
          },
        }
      case "2":
        return {
          dot1: {
            width: "60px",
            translateX: "102px",
            sm: { width: "50px", translateX: "90px" },
            md: { width: "60px", translateX: "102px" },
          },
          dot2: {
            width: "100px",
            translateX: "168px",
            sm: { width: "85px", translateX: "155px" },
            md: { width: "100px", translateX: "168px" },
          },
          dot3: {
            width: "230px",
            translateX: "315px",
            sm: { width: "200px", translateX: "280px" },
            md: { width: "230px", translateX: "315px" },
          },
        }
      case "3":
        return {
          dot1: {
            width: "60px",
            translateX: "98px",
            sm: { width: "50px", translateX: "85px" },
            md: { width: "60px", translateX: "98px" },
          },
          dot2: {
            width: "80px",
            translateX: "165px",
            sm: { width: "70px", translateX: "150px" },
            md: { width: "80px", translateX: "165px" },
          },
          dot3: {
            width: "165px",
            translateX: "270px",
            sm: { width: "145px", translateX: "240px" },
            md: { width: "165px", translateX: "270px" },
          },
        }
      default:
        return {
          dot1: { width: "0px", translateX: "0px" },
          dot2: { width: "0px", translateX: "0px" },
          dot3: { width: "0px", translateX: "0px" },
        }
    }
  }

  const { dot1, dot2, dot3 } = getDotStyles(selectedShirt?.id)

  return (
    <div className="mt-[-500px] flex-1 md:mt-[-150px] lg:mt-[0]">
      <div className="mt-[20px] flex translate-x-[150px] scale-[0.6] md:translate-x-[0px] md:scale-[0.8] lg:scale-[1] xl:translate-x-[50px] xl:scale-[1]">
        <Image
          src={selectedShirt?.src || ""}
          width={450}
          height={450}
          quality={100}
          alt="Main Shirt"
          className="lg:h-[450px]"
        />
        <Image
          src="/assets/images/bgRight.png"
          width={450}
          height={290}
          alt="Main Shirt"
          quality={100}
          className="absolute bottom-0 right-[-30px] z-[-1] md:right-[-80px] md:w-[450px] lg:right-[-50px] lg:h-[390px] lg:w-[450px] xl:right-[60px]"
        />
        <div className="absolute bottom-[24px] right-[180px] h-[9px] w-[210px] bg-black opacity-30 blur-md lg:right-[180px] xl:right-[338px]"></div>
      </div>
      <div className="mt-[-50px] hidden scale-[0.7] md:mt-9 md:translate-y-[8px] md:scale-[1] xl:block">
        {/* Dot 1 */}
        <div
          className="absolute h-[4.64px] transition-all duration-500 ease-out"
          style={{
            width: dot1.width,
            transform: `translateX(${dot1.translateX})`,
            background:
              "repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 4.64px, transparent 4.64px, transparent 9.28px)",
          }}
        ></div>
        {/* Dot 2 */}
        <div
          className="absolute h-[4.64px] transition-all duration-500 ease-out"
          style={{
            width: dot2.width,
            transform: `translateX(${dot2.translateX})`,
            background:
              "repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 4.64px, transparent 4.64px, transparent 9.28px)",
          }}
        ></div>
        {/* Dot 3 */}
        <div
          className="absolute h-[4.64px] transition-all duration-500 ease-out"
          style={{
            width: dot3.width,
            transform: `translateX(${dot3.translateX})`,
            background:
              "repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 4.64px, transparent 4.64px, transparent 9.28px)",
          }}
        ></div>
      </div>
      {shirts.length > 0 && (
        <div className="mt-[-90px] flex md:mt-[0]">
          {shirts?.map((shirt) => (
            <div
              key={shirt.id}
              className={`flex flex-1 cursor-pointer flex-col items-center gap-[20px] ${
                selectedShirt?.id === shirt.id ? "mt-0 pr-[60px]" : "pl-[0px]"
              }`}
              onClick={() => setSelectedShirt(shirt)}
            >
              <div className="flex">
                <div
                  className={`rounded-full border-2 border-white ${
                    selectedShirt?.id === shirt.id
                      ? "mt-[-13px] h-8 w-8 md:ml-[0px] md:mt-[-5px]"
                      : "mt-[-6px] h-4 w-4 md:mt-[2px]"
                  }`}
                  style={{ backgroundColor: shirt.mainColor }}
                ></div>
              </div>
              {shirt.src && (
                <Image
                  src={shirt.src}
                  alt="mô tả"
                  quality={100}
                  width={selectedShirt?.id === shirt.id ? 118 : 105}
                  height={selectedShirt?.id === shirt.id ? 118 : 105}
                  className="z-[1] max-h-[118px] min-h-[105px] min-w-[105px] max-w-[118px]"
                />
              )}

              {selectedShirt?.id === shirt.id && (
                <div className="flex h-[85px] w-[238px] -translate-y-[105px] translate-x-[67px] scale-[0.9] rounded-[20] md:scale-[1]">
                  <div
                    className="absolute flex h-full w-full rounded-full opacity-50 blur-xl"
                    style={{ backgroundColor: shirt.mainColor }}
                  />
                  <div className="z-[3] flex h-full w-full flex-col items-end justify-center rounded-[23px] bg-white pr-[25px] text-[18px]">
                    <p>{shirt.name} </p>
                    <p>{shirt.price}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
