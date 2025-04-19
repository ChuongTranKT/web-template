import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

import { Menu, X } from "lucide-react"
import { MENU } from "@/constants/menu" // Import menu từ constants
import { APIGetAboutUs } from "@/services/aboutUs"
import { useDispatch, useSelector } from "react-redux"

import { setAboutUs } from "@/store/slices/aboutUsSlice"

export default function Navbar() {
  const dispatch = useDispatch()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  useEffect(() => {
    handleGetAboutUs()
  }, [])

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
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed left-0 top-0 z-[1000] flex h-[100px] w-full items-center justify-between bg-white px-6 md:px-10">
      {/* Logo */}
      <img
        src={logoPreview}
        alt="logo"
        width={80}
        height={86}
        className="md:w-[125px]"
      />

      {/* Menu trên desktop */}
      <div className="hidden gap-8 text-[18px] md:flex">
        {MENU.map((item) => (
          <div key={item.path} className="group relative">
            <Link href={item.path}>
              <div
                className={`relative px-4 py-2 text-[18px] transition-all duration-300 ${
                  pathname === item.path
                    ? "font-bold text-[#79BCCF]"
                    : "text-[#787878]"
                }`}
              >
                {item.title}
              </div>
            </Link>

            {/* Dropdown cho category có con */}
            {item.children.length > 0 && (
              <div className="absolute left-0 hidden w-[200px] bg-white shadow-md group-hover:block">
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    href={`/products?category=${child.path}`}
                  >
                    <div className="px-4 py-2 text-[16px] hover:bg-gray-100">
                      {child.title}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nút menu trên mobile */}
      <button className="p-2 md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Menu trên mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-0 top-[80px] w-full bg-[#D9D9D9] text-center shadow-lg md:hidden"
          >
            {MENU.map((item) => (
              <div key={item.path} className="relative">
                <Link href={item.path}>
                  <div
                    onClick={() => setIsOpen(false)}
                    className={`block py-4 text-[18px] transition-all hover:text-[#79BCCF] ${
                      pathname === item.path
                        ? "font-bold text-[#79BCCF]"
                        : "text-[#787878]"
                    }`}
                  >
                    {item.title}
                  </div>
                </Link>

                {/* Dropdown cho category có con */}
                {item.children.length > 0 && (
                  <div className="w-full bg-gray-200">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        href={`/products?category=${child.path}`}
                      >
                        <div
                          className="py-2 text-[16px] hover:bg-gray-300"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
