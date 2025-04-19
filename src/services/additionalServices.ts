import axiosInstance from "./axiosInstance"

// const CustomerId = process.env.NEXT_PUBLIC_CUSTOMER_ID;

const APICreateNewAdditional = async (data: unknown) => {
  try {
    const response = await axiosInstance.post(
      "/additional-services/create-additional-service",
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

const APIGetAllAdditional = async () => {
  const customerId = process.env.NEXT_PUBLIC_CUSTOMER_ID
  try {
    const response = await axiosInstance.get(
      `/additional-services/get-all/${customerId}`
    )

    if (response.status === 200 && response.data.code === 200) {
      const data = response.data.content
      return {
        data: data,
        status: response.status,
      }
    } else if (response.status === 200 && response.data.code === 404) {
      return { status: 404, data: null }
    }

    return null
  } catch (err) {
    console.error("Error during get all about-us:", err)
    throw err // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
}
const APIGetAdditionalById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/additional-services/${id}`)

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

const APIUpdateAdditional = async (data: unknown, id: string) => {
  try {
    const response = await axiosInstance.put(
      `/additional-services/update-additional-service/${id}`,
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
const APIDeleteAdditional = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `/additional-services/delete-additional-service/${id}`
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

export {
  APICreateNewAdditional,
  APIGetAllAdditional,
  APIGetAdditionalById,
  APIUpdateAdditional,
  APIDeleteAdditional,
}
