// src/app/admin/layout.tsx
"use client"
import { Layout, Menu } from "antd"
import { AppstoreOutlined } from "@ant-design/icons"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const { Sider, Content, Footer } = Layout

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() // Lấy đường dẫn hiện tại
  const router = useRouter() // Khai báo router
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useEffect(() => {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem("access_token")
    if (!token) {
      // Nếu không có token, chuyển hướng về trang đăng nhập
      router.push("/login")
    }

    // Tìm key tương ứng với pathname
    const foundItem = menuItems
      .flatMap((item) => item.children || []) // Lấy toàn bộ các item con
      .find((child) => child.label.props.href === pathname)

    if (foundItem) {
      setSelectedKeys([foundItem.key])
    }
  }, [pathname, router]) // Thêm router vào dependency array

  const menuItems = [
    {
      key: "sub1",
      icon: <AppstoreOutlined />,
      label: "Trang chủ",
      children: [
        {
          key: "1",
          label: <Link href="/admin/cmsbanner">Quản lý Banner</Link>,
        },
        {
          key: "2",
          label: <Link href="/admin/cmscategory">Danh mục sản phẩm</Link>,
        },
        {
          key: "6",
          label: <Link href="/admin/danh-muc-giam-gia">Danh mục giảm giá</Link>,
        },
      ],
    },
    {
      key: "sub2",
      icon: <AppstoreOutlined />,
      label: "Sản phẩm",
      children: [
        {
          key: "3",
          label: <Link href="/admin/cmsproduct">Quản lý sản phẩm</Link>,
        },
      ],
    },
    {
      key: "sub3",
      icon: <AppstoreOutlined />,
      label: "Giới thiệu",
      children: [
        {
          key: "4",
          label: <Link href="/admin/cmsabout">Quản lý giới thiệu</Link>,
        },
      ],
    },
    {
      key: "sub4",
      icon: <AppstoreOutlined />,
      label: "Liên hệ",
      children: [
        {
          key: "5",
          label: <Link href="/admin/cmscontac">Quản lý liên hệ</Link>,
        },
      ],
    },
  ]

  return (
    <Layout className="min-h-screen">
      <Sider className="bg-gray-800" width={250}>
        <div className="logo-container">
          <Link href="/admin">
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              width={150}
              height={50}
              className="cursor-pointer"
            />
          </Link>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys} // Thay vì defaultSelectedKeys
          items={menuItems}
        />
      </Sider>

      <Layout className="flex-1">
        <Content className="bg-white p-6">
          <div className="rounded-lg shadow-md">{children}</div>
        </Content>

        <Footer className="py-4 text-center text-gray-600"></Footer>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
