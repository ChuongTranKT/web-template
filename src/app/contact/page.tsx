"use client"
import Footer from "@/components/footer"
import GoogleMap from "@/components/googleMap"
import {
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaTiktok,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa" // import icon từ react-icons
import { APIGetAboutUs } from "@/services/aboutUs"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { setAboutUs } from "@/store/slices/aboutUsSlice"

import { useEffect } from "react"

export default function ContactPage() {
  const aboutUs = useSelector((state: RootState) => state.aboutUs.aboutUs)
  const dispatch = useDispatch()

  const handleGetAboutUs = async () => {
    try {
      const response = await APIGetAboutUs()
      if (response?.status === 200) {
        dispatch(setAboutUs(response.data))
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleGetAboutUs()
  }, [])
  const contactInfo = [
    {
      nameShop: aboutUs.company_name,
      address: aboutUs.address,
      mobile: aboutUs.phone,
      email: aboutUs.email,
    },
  ]

  const { nameShop, address, mobile, email } = contactInfo[0]

  // Mảng mạng xã hội
  const socialMediaLinks = [
    {
      name: "facebook",
      url: aboutUs.facebook_link,
      icon: <FaFacebook className="text-blue-600" />,
    },
    {
      name: "Linkedin_link",
      url: aboutUs.linkedin_link,
      icon: <FaLinkedinIn className="text-red-600" />,
    },
    {
      name: "twitter",
      url: aboutUs.twitter_link,
      icon: <FaTwitter className="text-blue-400" />,
    },
    {
      name: "instargram",
      url: aboutUs.instagram_link,
      icon: <FaInstagram className="text-black" />,
    },
  ]

  return (
    <div>
      <div className="container mx-auto flex translate-x-[-90px] scale-[0.45] md:mt-[100px] md:translate-x-[-10px] md:scale-[0.9] xl:translate-x-0 xl:scale-[1]">
        {/* Left content */}
        <div className="w-[387px] bg-[#957F56] p-[20px] leading-[40px] text-white md:text-[16px] lg:text-[20px]">
          <p className="font-bold">{nameShop}</p>
          <p>{address}</p>
          <p>{mobile}</p>
          <p>{email}</p>

          {/* Social media icons */}
          <div className="mt-[30px] flex justify-start space-x-4">
            {socialMediaLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white">
                  {social.icon}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right content */}
        <div className="ml-[50px] w-[814px] shadow-lg">
          <form
            action={aboutUs.email}
            method="POST"
            encType="text/plain"
            target="_blank" // Thêm dòng này
            className="flex h-full w-full flex-col space-y-4 bg-white p-[20px]"
          >
            {/* Họ và tên & Số điện thoại cùng dòng */}
            <div className="flex space-x-4">
              <div className="flex w-1/2 flex-col">
                <label className="text-[16px]" htmlFor="fullName">
                  Họ và tên<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="Họ và tên"
                  required
                  className="rounded-[5px] border p-[10px] focus:outline-none"
                />
              </div>
              <div className="flex w-1/2 flex-col">
                <label className="text-[16px]" htmlFor="phone">
                  Số điện thoại<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="Số điện thoại"
                  required
                  className="rounded-[5px] border p-[10px] focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <label className="text-[16px]" htmlFor="email">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="Email"
              required
              className="rounded-[5px] border p-[10px] focus:outline-none"
            />

            {/* Nội dung */}
            <label className="pb-[20px]" htmlFor="content">
              Nội dung
            </label>
            <input
              type="text"
              id="content"
              name="Nội dung"
              className="h-[70px] rounded-[5px] border p-[10px] focus:outline-none"
            />

            {/* Nút gửi */}
            <button
              type="submit"
              className="mt-[10px] rounded-[5px] bg-[#C69C6D] px-4 py-2 text-white shadow-md hover:bg-slate-300"
            >
              Gửi yêu cầu
            </button>
          </form>
        </div>
      </div>{" "}
      <div className="mt-[-150px] md:mt-[0px]">
        <GoogleMap />
        <Footer />
      </div>
    </div>
  )
}
