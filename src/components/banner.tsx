"use client"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import ContactButton from "./ui/contacbtn"
import { useDispatch, useSelector } from "react-redux"

import { RootState } from "@/store/store"
import { APIGetBannersAll } from "@/services/banners"
import { setBanner } from "@/store/slices/bannerSlice"
import ListShirt from "./lishshirt"
import Image from "next/image"
import { useEffect } from "react"

export default function Banner() {
  const banner = useSelector((state: RootState) => state.banner.banner)
  const aboutUs = useSelector((state: RootState) => state.aboutUs.aboutUs)

  // Fetch dữ liệu banner từ API
  // const handleGetAllBanner = async () => {
  //   try {
  //     const response = await APIGetBannersAll()
  //     if (response?.status === 200) {
  //       dispatch(setBanner(response.data))
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // useEffect(() => {
  //   handleGetAllBanner()
  // }, [])

  // useEffect(() => {
  //   handleGetAllBanner()
  // }, [])
  const description = banner?.[0]?.description || ""
  const textColor =
    description.match(/color:(#[0-9a-fA-F]{6})/)?.[1] || "#5d0a0a"
  return (
    <div className="relative mx-auto flex w-full flex-col items-center">
      <div
        className="mt-[8.5px] h-[719px] w-full md:mt-[96px] md:h-[560px] lg:h-[650px] xl:h-[780px]"
        style={{
          backgroundImage: "url('/assets/images/bgBaner.png')",
          backgroundSize: "", // Hoặc 'contain' nếu bạn muốn hiển thị toàn bộ hình ảnh
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat", // Để tránh lặp lại hình ảnh
        }}
      >
        <Image
          src="/assets/images/vectorBaner.png"
          width={972}
          height={876}
          alt=""
          className="container absolute h-[750px] md:top-[-70px] lg:right-[280px] lg:top-[100px] lg:h-[750px] lg:w-[500px] xl:right-[490px] xl:top-[-50px] xl:h-[1009px] xl:w-[550px]"
        />{" "}
        <div className="container mx-auto flex flex-col items-center md:mt-[0] md:flex-row">
          {/* CONTEN LEFT */}
          <div className="flex-1 translate-x-[-20px] scale-[0.6] md:translate-x-[30px] md:scale-[0.9] lg:mt-[-100px] lg:translate-x-[50px] lg:scale-[0.9] xl:scale-[1]">
            <h1 className="mb-4 text-[24px] font-semibold tracking-wider text-white">
              {banner[0].title}
            </h1>

            <h1 className="mb-2 w-[500px] text-[64px] text-[#444444] md:w-[320px] md:text-[30px] lg:w-[500px] lg:text-[64px] xl:w-[500px]">
              <p className="font-bold">{aboutUs.slogan}</p>
            </h1>

            <p
              className="text-[14px] leading-[28px] lg:w-[450px]"
              style={{ color: textColor }}
            >
              {description.split("|")[0]}
            </p>

            <div className="mt-[50px]">
              {" "}
              <ContactButton />
            </div>
          </div>
          {/* CONTEN right */}
          <div className="flex-1 scale-[0.6] md:scale-[0.7] lg:scale-[0.7] xl:scale-[1]">
            {" "}
            <ListShirt />
          </div>
        </div>
      </div>
    </div>
  )
}
