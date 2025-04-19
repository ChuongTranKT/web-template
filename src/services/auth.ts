import { RefreshTokenReqType } from "../types/auth"
import axiosInstance from "./axiosInstance"
const APILoginAdmin = async (user_name: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      user_name: user_name,
      password: password,
    })

    return response.data
  } catch (err) {
    console.error("Error during login:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}

const APIRefreshToken = async (data: RefreshTokenReqType) => {
  try {
    const response = await axiosInstance.post(`/auth/refresh-token`, data)

    return response.data
  } catch (err) {
    console.error("Error during get info company:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}

// const APIChangePassword = async (data: ChangePasswordReqType) => {
//   try {
//     const response = await axiosInstance.put(`/admin/change-password`, data)

//     return response.data
//   } catch (err) {
//     console.error('Error during change password:', err)
//     throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
//   }
// }

export { APILoginAdmin, APIRefreshToken }
