import axiosInstance from "./axiosInstance"

// const CustomerId = process.env.NEXT_PUBLIC_CUSTOMER_ID;

const APICreateNewBanners = async (data: unknown) => {
  try {
    const response = await axiosInstance.post(
      "/banners/create-new-banner",
      data
    )

    if (response.status === 201 && response.data.code === 200) {
      const data = response.data.content
      return { data: data, status: response.status }
    }

    return null
  } catch (err) {
    console.error("Error during create about-us:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}

const APIGetBannersAll = async () => {
  const customerId = process.env.NEXT_PUBLIC_CUSTOMER_ID
  try {
    const response = await axiosInstance.get(
      `banners/get-all-banner/${customerId}`
    )

    if (response.status === 200 && response.data.code === 200) {
      const data = response.data.content
      return { data: data, status: response.status }
    }

    return null
  } catch (err) {
    console.error("Error during get about-us by id:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}
const APIGetBannerById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/banners/${id}`)

    if (response.status === 200 && response.data.code === 200) {
      const data = response.data.content
      return { data: data, status: response.status }
    }

    return null
  } catch (err) {
    console.error("Error during get about-us by id:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}

const APIUpdateBanners = async (data: unknown, id: string) => {
  try {
    const response = await axiosInstance.put(
      `/banners/update-banner/${id}`,
      data
    )

    if (response.status === 200 && response.data.code === 200) {
      const data = response.data.content
      return { data: data, status: response.status }
    }

    return null
  } catch (err) {
    console.error("Error during update aboutUs:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}
const APIDeleteBanners = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/banners/delete/${id}`)

    if (response.status === 200 && response.data.code === 200) {
      const data = response.data.content
      return { data: data, status: response.status }
    }

    return null
  } catch (err) {
    console.error("Error during update aboutUs:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}

export {
  APICreateNewBanners,
  APIDeleteBanners,
  APIGetBannerById,
  APIUpdateBanners,
  APIGetBannersAll,
}
