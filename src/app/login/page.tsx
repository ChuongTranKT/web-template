"use client"

import React, { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { Input } from "@/components/ui/input"
import { APILoginAdmin, APIRefreshToken } from "@/services/auth"
import { useRouter } from "next/navigation"
import { setTokenDecode } from "@/store/slices/authSlice"
import { setAboutUs } from "@/store/slices/aboutUsSlice"
import { RootState } from "@/store/store"
import { APIGetAboutUs } from "@/services/aboutUs"
import { useDispatch, useSelector } from "react-redux"
import { Button, Spin, Alert } from "antd"

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [alert, setAlert] = useState({ type: "", message: "", visible: false })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const tokenDecode = useSelector((state: RootState) => state.auth.tokenDecode)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async () => {
    setIsLoading(true)
    const response = await APILoginAdmin(formData.username, formData.password)
    if (response?.code === 200) {
      localStorage.setItem("access_token", response?.content?.access_token)
      localStorage.setItem("refresh_token", response?.content?.refresh_token)
      localStorage.setItem(
        "expires_at",
        (Date.now() + response?.content?.exp_token * 1000).toString()
      )
      localStorage.setItem(
        "refresh_token_expires_in",
        (Date.now() + response?.content?.exp_refresh_token * 1000).toString()
      )

      setAlert({
        type: "success",
        message: "Đăng nhập thành công",
        visible: true,
      })
      setTimeout(() => {
        setAlert({ type: "", message: "", visible: false })
        router.push("/admin/")
      }, 10)
    } else {
      setAlert({ type: "error", message: response?.message, visible: true })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const access_token = localStorage.getItem("access_token")
    if (access_token) {
      const decoded = jwtDecode(access_token as string)
      dispatch(setTokenDecode(decoded))
      handleGetAboutUs(decoded.id)
    }
  }, [])

  const handleGetAboutUs = async (userId: string) => {
    try {
      const response = await APIGetAboutUs(userId)
      if (response?.status === 200) {
        dispatch(setAboutUs(response.data))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-80 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-center text-lg font-semibold">Đăng nhập</h2>
        {alert.visible && (
          <Alert
            message={alert.message}
            type={alert.type}
            showIcon
            className="mb-4"
          />
        )}
        <Input
          placeholder="Tài khoản"
          name="username"
          onChange={handleInputChange}
          className="mb-3"
        />
        <Input
          placeholder="Mật khẩu"
          name="password"
          type="password"
          onChange={handleInputChange}
          className="mb-3"
        />
        <Button type="primary" block onClick={handleLogin} disabled={isLoading}>
          {isLoading ? <Spin size="small" /> : "Đăng nhập"}
        </Button>
      </div>
    </div>
  )
}
