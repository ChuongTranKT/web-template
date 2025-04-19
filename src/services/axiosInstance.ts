import axios from "axios"

// Tạo instance Axios

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    // 'http://192.168.2.28:4004/api/v1' ||
    // 'http://192.168.1.5:4004/api/v1' ||
    "http://192.168.102.72:4004/api/v1", // Base URL của API
  // baseURL: 'http://192.168.1.142:4003/api/v1', // Base URL của API

  timeout: 10000, // Thời gian chờ request
})

// Request Interceptor: Thêm token vào header nếu cần
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token") // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Xử lý lỗi hoặc refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Ví dụ: Tự động refresh token khi hết hạn
      // const newToken = await refreshAccessToken();
      // Save token và thử lại request...
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
