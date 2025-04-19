import { MenuType } from "@/types/menu"

export const MENU: MenuType[] = [
  {
    title: "Trang chủ",
    path: "/",
    children: [],
  },
  {
    title: "Giới thiệu",
    path: "/about",
    children: [],
  },
  {
    title: "Sản phẩm",
    path: "/products",
    children: [
      // { title: 'Áo thun', path: '/products?category=ao-thun' },
      // { title: 'Quần jean', path: '/products?category=quan-jean' },
      // { title: 'Giày dép', path: '/products?category=giay-dep' },
    ],
  },
  {
    title: "Liên hệ",
    path: "/contact",
    children: [],
  },
]
