import axiosInstance from "./axiosInstance"

// const CustomerId = process.env.NEXT_PUBLIC_CUSTOMER_ID;

const APICreateNewCategory = async (data: unknown) => {
  try {
    const response = await axiosInstance.post(
      "/products/create-new-product-category",
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

const APIGetAllCategory = async () => {
  const customerId = process.env.NEXT_PUBLIC_CUSTOMER_ID
  try {
    const response = await axiosInstance.get(
      `/products/get-all-product-categories/${customerId}`
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
const APIGetCategoryById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `/products/get-product-category/${id}`
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

const APIUpdateCategory = async (data: unknown, id: string) => {
  try {
    const response = await axiosInstance.put(
      `/products/update-product-category/${id}`,
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
const APIDeleteCategory = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `/products/delete-product-category/${id}`
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
  APICreateNewCategory,
  APIGetAllCategory,
  APIUpdateCategory,
  APIDeleteCategory,
  APIGetCategoryById,
}
