"use client"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { APIGetAboutUs } from "@/services/aboutUs"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { setAboutUs } from "@/store/slices/aboutUsSlice"
import {
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaLinkedin,
  FaIntercom,
} from "react-icons/fa" // Các social icons
import {
  HiOutlineClock,
  HiMail,
  HiPhone,
  HiLocationMarker,
} from "react-icons/hi" // Các icon khác như giờ, điện thoại, email, địa chỉ

export default function Footer() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const aboutUs = useSelector((state: RootState) => state.aboutUs.aboutUs)
  const dispatch = useDispatch()

  const handleGetAboutUs = async () => {
    try {
      const response = await APIGetAboutUs()
      if (response?.status === 200) {
        dispatch(setAboutUs(response.data))
        setLogoPreview(
          response.data.logo
            ? `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${response.data.logo}`
            : null
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleGetAboutUs()
  }, [])
  const socialLinks = [
    {
      href: aboutUs.facebook_link,
      icon: <FaFacebook size={19} color="white" />, // Đặt màu trắng cho icon
    },
    {
      href: aboutUs.instagram_link,
      icon: <FaIntercom size={20} color="white" />,
    },
    {
      href: aboutUs.linkedin_link,
      icon: <FaLinkedin size={14} color="white" />,
    },
  ]
  const contactInfo = [
    {
      icon: <HiOutlineClock size={15} color="white" />, // Icon đồng hồ
      label: "Mở cửa mỗi ngày",
      content: aboutUs.open_time,
    },
    {
      icon: <HiMail size={15} color="white" />, // Icon email
      label: "Email",
      content: aboutUs.email,
    },
    {
      icon: <HiPhone size={15} color="white" />, // Icon điện thoại
      label: "Hotline",
      content: aboutUs.phone,
    },
    {
      icon: <HiLocationMarker size={15} color="white" />, // Icon địa chỉ
      label: "Địa chỉ",
      content: aboutUs.address,
    },
  ]

  return (
    <div className="h-[350px] items-center bg-[#82A5AE] text-white lg:h-[532px] lg:pl-14">
      <div className="flex flex-grow justify-between px-3 pt-10 lg:w-[800px] lg:pt-20 xl:w-[1100px]">
        <div className="flex flex-col gap-5 xl:pl-20">
          <img
            className="lg:w-[150px]"
            src={logoPreview}
            alt=""
            width={100}
            height={114}
            quality={1000}
          />
          <div className="mr-8 flex items-center justify-end gap-[30px] lg:gap-[20px]">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white" // Đảm bảo icon có màu trắng
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between p-3 pt-[5px] lg:gap-4">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex flex-col pt-[10px]">
              <div className="flex space-x-2">
                {info.icon} {/* Sử dụng icon đã thay đổi màu */}
                <span className="text-[10px] font-bold text-white lg:text-[19px]">
                  {info.label}:
                </span>
              </div>
              <p className="pl-6 text-[10px] text-white lg:text-[18px]">
                {info.content}
              </p>
            </div>
          ))}
        </div>

        <div className="w-[65px] pt-[16px] text-[10px] font-bold text-white lg:w-[80px] lg:text-[16px]">
          <h1>Giới thiệu</h1>
          <p className="py-2">Dịch vụ</p>
          <p>Liên hệ</p>
        </div>
      </div>

      <p className="pb-[10px] pt-[40px] text-center text-[10px] font-bold text-[#49707a] lg:pt-[60px] lg:text-[14px]">
        {`Copyright © ${new Date().getFullYear()} ${aboutUs.company_name}`}
      </p>
    </div>
  )
}
