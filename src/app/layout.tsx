"use client"
import { usePathname } from "next/navigation" // Dùng hook để lấy pathname hiện tại
import { store } from "@/store/store"
import { Geist, Geist_Mono } from "next/font/google"
import { Provider } from "react-redux"
import "./globals.css"
import { metadata } from "./metadata"
import Navbar from "@/components/navbar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname() // Lấy đường dẫn hiện tại

  // Kiểm tra nếu trang hiện tại thuộc các trang được cho phép hiển thị Navbar
  const showNavbar = ["/", "/about", "/products", "/products/[id]"].some(
    (path) => {
      // Kiểm tra nếu pathname bắt đầu với một trong các path được cho phép và loại trừ /admin và /login
      return (
        (pathname === path || pathname.startsWith(path)) &&
        !pathname.startsWith("/admin") &&
        !pathname.startsWith("/login")
      )
    }
  )

  return (
    <html lang="en">
      <head>
        <title>{String(metadata.title) ?? "Default Title"}</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div>
          {/* Chỉ render Navbar nếu trang hiện tại thuộc danh sách được cho phép */}

          <Provider store={store}>
            {" "}
            {showNavbar && <Navbar />}
            {children}
          </Provider>
        </div>
      </body>
    </html>
  )
}
