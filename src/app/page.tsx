"use client"
import Banner from "@/components/banner"
import Collecttion from "@/components/collection"
import SlideFavoriteProduct from "@/components/favoriteproductlist"
import Footer from "@/components/footer"
import SlidePartner from "@/components/slidePatner"
import ContactButton from "@/components/ui/contacbtn"
import Image from "next/image"
import BannerTrangChuBottom from "@/components/bannertrangchubottom"
export default function Home() {
  return (
    <div>
      <div>
        {" "}
        <Banner />
      </div>

      <div className="mt-[-70px] pb-[20px] pt-[100px] text-center md:mt-[0px] lg:mt-[0px] xl:mt-[0px]">
        <p className="relative inline-block md:text-[24px]">
          BỘ SƯU TẬP
          {/* Border bottom */}
          <span className="absolute bottom-[-5] left-1/2 w-[60px] -translate-x-1/2 transform rounded-full border-b-4 border-[#374151] md:w-[88px]"></span>
        </p>
      </div>
      <div className="mt-7">
        {" "}
        <Collecttion />
        <div className="mt-[-600px] md:mt-[-240px] lg:mt-[0px]">
          <div className="mt-[-50px] pb-[-50px] pt-[250px] text-center md:mt-[0px] md:pt-[90px] lg:mt-[0px] lg:pt-[100px] lg:pt-[20px] xl:mt-[50px]">
            <p className="relative inline-block md:text-[24px]">
              SẢN PHẨM ĐƯỢC YÊU THÍCH
              {/* Border bottom */}
              <span className="absolute bottom-[-5] left-1/2 w-[60px] -translate-x-1/2 transform rounded-full border-b-4 border-[#374151] md:w-[88px]"></span>
            </p>
          </div>
          <SlideFavoriteProduct />
        </div>
        <div className="">
          <div className="mt-[10px] pb-[-50px] pt-[100px] text-center md:mt-[0px] lg:mt-[0px] xl:mt-[0px]">
            <p className="relative inline-block pb-[40px] md:text-[24px]">
              CÁC THƯƠNG HIỆU LIÊN KẾT
              {/* Border bottom */}
            </p>
          </div>
          <SlidePartner />
        </div>
        <BannerTrangChuBottom />
        <Footer />
      </div>
    </div>
  )
}
